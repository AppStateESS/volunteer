'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Grid from './Grid'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {getList, ajaxPunchOut, deletePunch} from '../api/Fetch'
import useInterval from '../api/UseInterval'

/* global sponsorId */

const Waiting = ({sponsorId}) => {
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [reasonList, setReasonList] = useState([])
  const [error, setError] = useState(null)
  const [isRunning, setIsRunning] = useState(true)
  const delay = 60000

  useEffect(() => {
    loadReasons()
    loadList()
  }, [])

  useInterval(
    () => {
      loadList()
    },
    isRunning ? delay : null
  )

  const loadReasons = () => {
    getList('./volunteer/Admin/Reason/?sortById=true').then((response) => {
      setReasonList(response.data)
    })
  }

  const punchOut = (punchId) => {
    const Promise = ajaxPunchOut(punchId)
    Promise.then(() => {
      loadList()
    })
  }

  const remove = (punch) => {
    deletePunch(punch.id).then(loadList)
  }

  const loadList = () => {
    setLoading(true)
    getList(`volunteer/Admin/Punch/waiting?sponsorId=${sponsorId}`)
      .then((response) => {
        setError(null)
        if (response.data) {
          setListing(response.data)
        } else {
          setListing([])
        }
      })
      .catch(() => {
        setError(<span>Error pulling listing.</span>)
        setListing([])
      })
      .then(() => setLoading(false))
  }

  if (error !== null) {
    return <div className="alert alert-danger">{error}</div>
  } else if (loading) {
    return (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-2">Currently waiting</h2>
      <Grid {...{listing, punchOut, remove, reasonList}} />{' '}
    </div>
  )
}

Waiting.propTypes = {sponsorId: PropTypes.number}

ReactDOM.render(
  <Waiting sponsorId={sponsorId} />,
  document.getElementById('Waiting')
)
