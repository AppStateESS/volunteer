'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import {getList, deleteVolunteer} from '../api/Fetch'
import Grid from './Grid.js'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const Volunteer = () => {
  const track = useRef(null)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({field: null, direction: 'none'})

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
    return () => clearTimeout(track.current)
  }, [search, sort])

  const loadList = (search = '') => {
    setLoading(true)
    const params = {search}
    if (sort.direction !== 'none' && sort.field) {
      params.sortBy = sort.field
      params.sortDir = sort.direction
    }
    const Promise = getList('volunteer/Admin/Volunteer/', params)
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.error(error)
    })
  }

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
        <Grid
          listing={listing}
          sort={sort}
          setSort={setSort}
          deleteVolunteer={(id) => {
            deleteVolunteer(id).then(() => {
              loadList(search)
            })
          }}
        />
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

ReactDOM.render(<Volunteer />, document.getElementById('Volunteer'))
