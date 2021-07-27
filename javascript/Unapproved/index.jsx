'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import Grid from './Grid'

const Unapproved = () => {
  const [listing, setListing] = useState([])
  const [loading, setLoading] = useState(true)

  const loadList = (search) => {
    setLoading(true)
    const Promise = getList('volunteer/Admin/Punch/unapproved', {search})
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    loadList()
  }, [])

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
        <p>No unapproved punches found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid listing={listing} load={loadList} setListing={setListing} />
      </div>
    )
  }

  return <div>{content}</div>
}

ReactDOM.render(<Unapproved />, document.getElementById('Unapproved'))
