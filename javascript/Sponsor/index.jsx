'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Grid from './Grid'
import Form from './Form'
import Overlay from '@essappstate/canopy-react-overlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const getDefault = () => {
  return Object.assign({}, {id: 0, name: ''})
}

const Sponsor = () => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [sponsor, setSponsor] = useState(getDefault())
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    loadList()
  }, [])

  const loadList = () => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Sponsor/')
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  const edit = (key) => {
    setSponsor(Object.assign({}, listing[key]))
    setShowModal(true)
  }

  const reset = () => {
    const defaultSponsor = getDefault()
    setSponsor(defaultSponsor)
    setShowModal(false)
  }

  const success = () => {
    console.log('success')
    reset()
    loadList()
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
        <Grid listing={listing} edit={edit} />
      </div>
    )
  }
  const modalForm = <Form {...{sponsor, success, failure}} />

  return (
    <div>
      <h2>Sponsors</h2>
      <Overlay show={showModal} close={reset} title={modalTitle} width="80%">
        {modalForm}
      </Overlay>
      <button className="btn btn-primary" onClick={setShowModal}>
        Add sponsor
      </button>
      <hr />
      {content}
    </div>
  )
}

ReactDOM.render(<Sponsor />, document.getElementById('Sponsor'))
