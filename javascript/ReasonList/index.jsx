'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import Grid from './Grid'
import Form from './Form'
import {getList, sendDeleteReason} from '../api/Fetch'
import Overlay from '@essappstate/canopy-react-overlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const getDefault = () => {
  return {id: 0, title: '', description: '', forceAttended: false}
}

const ReasonList = () => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [reason, setReason] = useState(getDefault())
  const [showModal, setShowModal] = useState(false)
  const [sort, setSort] = useState({field: null, direction: 'none'})
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current.focus()
  }, [showModal])

  useEffect(() => {
    loadList()
  }, [sort])

  const loadList = (search = '') => {
    setLoading(true)
    const params = {search}
    if (sort.direction !== 'none' && sort.field) {
      params.sortBy = sort.field
      params.sortDir = sort.direction
    }
    const Promise = getList('volunteer/Admin/Reason/', params)
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.error(error)
    })
  }

  const reverseListing = () => {
    setListing([...listing.reverse()])
  }

  const edit = (key) => {
    setReason(Object.assign({}, listing[key]))
    setShowModal(true)
  }

  const deleteReason = (key) => {
    if (
      confirm(
        'Deleting this reason will remove all punch associations.\nAre you sure you want to do this?'
      )
    ) {
      sendDeleteReason(listing[key].id).then(() => {
        loadList()
      })
    }
  }

  const reset = () => {
    const defaultReason = getDefault()
    setReason(defaultReason)
    setShowModal(false)
  }

  const success = () => {
    reset()
    loadList()
  }

  const failure = () => {
    reset()
  }

  const modalTitle = reason.id === 0 ? 'Add reason' : 'Update reason'
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
        <p>No reasons found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid
          {...{
            reverseListing,
            listing,
            edit,
            deleteReason,
            sort,
            setSort,
          }}
        />
      </div>
    )
  }
  const modalForm = <Form {...{reason, success, failure, reset, titleRef}} />
  const modalShow = () => {
    setShowModal(true)
  }
  return (
    <div>
      <h2>Reasons</h2>
      <Overlay show={showModal} close={reset} title={modalTitle} width="80%">
        {modalForm}
      </Overlay>
      <div className="row">
        <div className="col-3">
          <button className="btn btn-primary" onClick={modalShow}>
            Add reason
          </button>
        </div>
      </div>
      <hr />
      {content}
    </div>
  )
}

ReactDOM.render(<ReasonList />, document.getElementById('ReasonList'))
