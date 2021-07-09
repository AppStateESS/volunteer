'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getSponsorReasonIds, getList, assignReasons} from '../api/Fetch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

const wait = (delay) => {
  const promise = new Promise((resolve) => setTimeout(resolve, delay))
  return promise
}

/* global sponsorId */
const AssignReason = (props) => {
  const [loading, setLoading] = useState(true)
  const [sponsorList, setSponsorList] = useState([])
  const [reasonList, setReasonList] = useState([])
  const [matchList, setMatchList] = useState([])
  const [sponsorId, setSponsorId] = useState(props.sponsorId)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([loadSponsors(), loadReasons()]).then((response) => {
      setSponsorList(response[0].data)
      setReasonList(response[1].data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadMatches(sponsorId)
  }, [sponsorId])

  const updateMatch = (id) => {
    const idx = matchList.indexOf(id)
    if (idx > -1) {
      matchList.splice(idx, 1)
    } else {
      matchList.push(id)
    }
    setMatchList([...matchList])
  }

  const getMatches = (sponsorId) => {
    return getSponsorReasonIds(sponsorId)
  }

  const loadMatches = (sponsorId) => {
    if (sponsorId == 0) {
      setMatchList([])
    }
    getMatches(sponsorId).then((response) => {
      setMatchList(response.data)
    })
  }

  const loadReasons = () => {
    return getList('volunteer/Admin/Reason')
  }

  const loadSponsors = () => {
    return getList('volunteer/Admin/Sponsor')
  }
  if (loading) {
    return (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  }
  if (sponsorList.length === 0) {
    return (
      <div>
        <h2>No sponsors found</h2>
        <p>
          <a href="./volunteer/Admin/Sponsor">Go to this page</a> and create a
          new sponsor.
        </p>
      </div>
    )
  }
  if (reasonList.length === 0) {
    return (
      <div>
        <h2>No reasons found</h2>
        <p>
          <a href="./volunteer/Admin/Reason">Go to this page</a> and create some
          reasons.
        </p>
      </div>
    )
  }

  const rows = reasonList.map((value) => {
    let checked = matchList.includes(value.id)
    return (
      <tr key={`reason-${value.id}`}>
        <td>
          <input
            type="checkbox"
            value={value.id}
            name="reasonId"
            checked={checked}
            onChange={() => updateMatch(value.id)}
          />
        </td>
        <td>{value.title}</td>
        <td>{value.forceAttended ? 'Yes' : 'No'}</td>
      </tr>
    )
  })

  const saveAssignments = () => {
    setSaving(true)
    assignReasons(sponsorId, matchList).then(() => {
      wait(1000).then(() => {
        setSaving(false)
      })
    })
  }

  const sponsorSelect = () => {
    const options = sponsorList.map((value) => {
      return (
        <option key={`sponsor-${value.id}`} value={value.id}>
          {value.name} {value.useReasons ? '' : '(disabled)'}
        </option>
      )
    })
    return (
      <div className="row mb-2">
        <div className="col-sm-3">Reasons for sponsor:</div>
        <div className="col-sm-6">
          <select
            className="form-control"
            value={sponsorId}
            onChange={(e) => setSponsorId(e.target.value)}>
            <option value="0">Choose a sponsor below</option>
            {options}
          </select>
          <p className="small">
            The (disabled) label means the sponsor will not show reasons until
            enabled.
          </p>
        </div>
      </div>
    )
  }

  let saveLabel = <span>Save reasons to sponsor</span>
  if (saving) {
    saveLabel = (
      <span>
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Saving...
      </span>
    )
  }

  return (
    <div>
      <h2>Assign reasons to sponsor</h2>
      {sponsorSelect()}
      <table className="table table-striped">
        <tbody>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Force attend</th>
          </tr>
          {rows}
        </tbody>
      </table>
      <button
        className="btn btn-success"
        disabled={saving}
        onClick={saveAssignments}>
        {saveLabel}
      </button>
    </div>
  )
}

AssignReason.propTypes = {
  sponsorId: PropTypes.number,
}

ReactDOM.render(
  <AssignReason sponsorId={sponsorId} />,
  document.getElementById('AssignReason')
)
