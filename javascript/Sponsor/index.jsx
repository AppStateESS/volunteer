'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Grid from './Grid'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

const Sponsor = () => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  useEffect(() => {
    load()
  }, [])

  const load = () => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Sponsor/')
    Promise.then((response) => {
      setLoading(false)
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
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
        <p>No sponsors found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <table className="table">
          <tbody></tbody>
        </table>
      </div>
    )
  }
  return content
}

ReactDOM.render(<Sponsor />, document.getElementById('Sponsor'))
