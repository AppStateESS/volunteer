'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {getList, sendSponsorEmails} from '../api/Fetch'
import ReactDOM from 'react-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

/* global volunteerId */
const Email = ({volunteerId}) => {
  const [loading, setLoading] = useState(true)
  const [sponsors, setSponsors] = useState([])
  const [checked, setChecked] = useState([])
  const [sendingProgress, setSendingProgress] = useState(0)

  useEffect(() => {
    setLoading(true)
    getList('./volunteer/Admin/Sponsor', {quickLogOnly: 1}).then((response) => {
      setSponsors(response.data)
      setLoading(false)
    })
  }, [])

  const sendEmails = () => {
    setSendingProgress(1)
    sendSponsorEmails(checked, volunteerId).then(() => {
      setSendingProgress(2)
    })
  }

  const updateChecked = (key) => {
    const idx = checked.indexOf(key)
    if (idx == -1) {
      checked.push(key)
    } else {
      checked.splice(idx, 1)
    }
    setChecked([...checked])
  }
  return (
    <div>
      {loading && (
        <div>
          <FontAwesomeIcon icon={['fa', 'spinner']} spin /> Loading sponsors...
        </div>
      )}
      {sponsors.length === 0 && <div>No sponsors found.</div>}
      {sponsors.length > 0 && (
        <div>
          <p>Select one or more sponsors below:</p>
          {sponsors.map((sponsor) => {
            return (
              <div key={`sponsor-${sponsor.id}`}>
                <label>
                  <input
                    type="checkbox"
                    name="sponsors[]"
                    checked={checked.indexOf(sponsor.id) !== -1}
                    value={sponsor.id}
                    onChange={() => updateChecked(sponsor.id)}
                  />
                  &nbsp;
                  {sponsor.name}
                </label>
              </div>
            )
          })}
        </div>
      )}

      <br />
      {sendingProgress === 0 && (
        <button
          className="btn btn-outline-dark"
          type="button"
          disabled={checked.length === 0}
          onClick={sendEmails}>
          Send emails
        </button>
      )}
      {sendingProgress === 1 && (
        <div className="alert alert-outline-success">Sending emails...</div>
      )}
      {sendingProgress === 2 && (
        <div className="alert alert-success">Emails sent!</div>
      )}
    </div>
  )
}

Email.propTypes = {volunteerId: PropTypes.number}

ReactDOM.render(<Email {...{volunteerId}} />, document.getElementById('Email'))
