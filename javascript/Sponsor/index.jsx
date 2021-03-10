'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Grid from './Grid'
import Form from './Form'
import Modal from '../api/Modal'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const getDefault = () => {
  return Object.assign({}, {id: 0, name: ''})
}

const Sponsor = () => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [sponsor, setSponsor] = useState(getDefault())
  useEffect(() => {
    loadList()
  }, [])

  const loadList = () => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Sponsor/')
    Promise.then((response) => {
      setLoading(false)
      //console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  const reset = () => {
    const defaultSponsor = getDefault()
    setSponsor(defaultSponsor)
  }

  const success = () => {
    reset()
  }

  const failure = () => {
    reset()
  }

  const modalTitle = sponsor.id === 0 ? 'Add sponsor' : 'Update sponsor'

  let content
  if (loading) {
    content = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else if (listing.length === 0) {
    content = (
      <div>
        <p>No sponsors found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid listing={listing} />
      </div>
    )
  }
  const modalForm = <Form {...{sponsor, success, failure}} />

  return (
    <div>
      <h2>Sponsors</h2>
      <Modal
        modalId="volModal"
        content={modalForm}
        title={modalTitle}
        onClose={reset}
      />
      <button
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#volModal">
        Add sponsor
      </button>
      <hr />
      {content}
    </div>
  )
}

ReactDOM.render(<Sponsor />, document.getElementById('Sponsor'))
