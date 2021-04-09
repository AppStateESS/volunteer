'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Grid from './Grid'
import {getList} from '../api/Fetch'
import FullName from '../api/Name'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

/* global volunteer */
const VolunteerReport = ({volunteer}) => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])

  const load = () => {
    setLoading(true)
    const Promise = getList(
      `volunteer/Admin/Punch/report/?volunteerId=${volunteer.id}`
    )
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(load, [volunteer.id])

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
        <p>No sessions found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid {...{listing, load}} />
      </div>
    )
  }

  let note
  if (volunteer.preferredName.length > 0) {
    note = <div className="small mb-4">Preferred name is in parentheses.</div>
  }

  return (
    <div>
      <h2 className="mb-0">
        <FullName volunteer={volunteer} useAbbr={false} />
      </h2>
      {note}
      <hr />
      {content}
    </div>
  )
}

VolunteerReport.propTypes = {volunteer: PropTypes.object}

ReactDOM.render(
  <VolunteerReport volunteer={volunteer} />,
  document.getElementById('VolunteerReport')
)
