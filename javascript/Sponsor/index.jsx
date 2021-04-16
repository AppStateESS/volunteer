'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {getList, sendKiosk} from '../api/Fetch'
import Grid from './Grid'
import Form from './Form'
import Overlay from '@essappstate/canopy-react-overlay'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const getDefault = () => {
  return Object.assign({}, {id: 0, name: ''})
}

const Sponsor = () => {
  const track = useRef(null)
  const nameInput = useRef(null)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [sponsor, setSponsor] = useState(getDefault())
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const updateKiosk = (key) => {
    const listCopy = [...listing]
    const sponsor = listCopy[key]
    sponsor.kioskMode = 1 - sponsor.kioskMode
    sendKiosk(sponsor.id, sponsor.kioskMode)
    listCopy[key] = sponsor
    setListing(listCopy)
  }
  const loadList = (search = '') => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Sponsor/', {search})
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    nameInput.current.focus()
  }, [showModal])

  useEffect(() => {
    clearTimeout(track.current)
    if (search.length > 3) {
      track.current = setTimeout(() => {
        loadList(search)
      }, 1000)
      return () => clearTimeout(track.current)
    } else if (search.length == 0) {
      loadList()
    }
  }, [search])

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
    reset()
    loadList()
  }

  const failure = () => {
    reset()
  }

  const sendSearch = () => {
    clearTimeout(track.current)
    loadList(search)
  }

  const clearSearch = () => {
    setSearch('')
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
        <Grid listing={listing} edit={edit} sendKiosk={updateKiosk} />
      </div>
    )
  }
  const modalForm = <Form {...{sponsor, success, failure, nameInput, reset}} />
  const modalShow = () => {
    nameInput.current.focus()
    setShowModal(true)
  }

  return (
    <div>
      <h2>Sponsors</h2>
      <Overlay show={showModal} close={reset} title={modalTitle} width="80%">
        {modalForm}
      </Overlay>
      <div className="row">
        <div className="col-3">
          <button className="btn btn-primary" onClick={modalShow}>
            Add sponsor
          </button>
        </div>
        <div className="col-9">
          <div className="input-group mb-3">
            <input
              name="search"
              className="form-control"
              placeholder="Search sponsors"
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  loadList(search)
                }
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={sendSearch}>
              Search
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={clearSearch}>
              Clear
            </button>
          </div>
        </div>
      </div>
      <hr />
      {content}
    </div>
  )
}

ReactDOM.render(<Sponsor />, document.getElementById('Sponsor'))
