'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Grid from './Grid.js'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
/*global domain */

const Volunteer = ({domain}) => {
  const track = useRef(null)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [search, setSearch] = useState('')

  const loadList = (search) => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Volunteer/', {search})
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

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

  const sendSearch = () => {
    clearTimeout(track.current)
    loadList(search)
  }

  const clearSearch = () => {
    setSearch('')
  }

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
        <p>No volunteers found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid listing={listing} domain={domain} />
      </div>
    )
  }
  return (
    <div>
      <h2>Volunteers</h2>

      <div className="row">
        <div className="col-9">
          <div className="input-group mb-3">
            <input
              name="search"
              className="form-control"
              placeholder="Search volunteers"
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

ReactDOM.render(
  <Volunteer domain={domain} />,
  document.getElementById('Volunteer')
)
