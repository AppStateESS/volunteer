'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'
import {Day, TimeFormat, ApproveButton, TimeOut, ChangeTime} from './Time'

const SponsorGrid = ({sponsor, listing, punchOut, approve, edit}) => {
  let rows
  if (listing.length == 0) {
    rows = (
      <tr>
        <td colSpan="6">No rows found.</td>
      </tr>
    )
  } else {
    rows = listing.map((value, key) => {
      return (
        <tr key={`row-${value.id}`}>
          <td>
            {value.timeOut ? (
              <ChangeTime edit={() => edit(key)} />
            ) : (
              <span></span>
            )}
          </td>
          <td>
            <a href={`./volunteer/Admin/Volunteer/${value.volunteerId}/report`}>
              <FullName volunteer={value} useAbbr={false} />
            </a>
          </td>
          <td>
            <Day time={value.timeIn} />
          </td>
          <td>
            <TimeFormat time={value.timeIn} />
          </td>
          <td>
            <TimeOut punch={value} punchOut={punchOut} edit={() => edit(key)} />
          </td>
          <td>{value.totalTime}</td>
          <td>
            <ApproveButton value={value} approve={approve} />
          </td>
        </tr>
      )
    })
  }

  return (
    <div>
      <h2>Punches for sponsor: {sponsor.name}</h2>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>&nbsp;</th>
            <th>Volunteer/Attendee</th>
            <th>Date</th>
            <th>Clock in</th>
            <th>Clock out</th>
            <th>Total time</th>
            <th>Approved</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

SponsorGrid.propTypes = {
  sponsor: PropTypes.object,
  loading: PropTypes.bool,
  listing: PropTypes.array,
  punchOut: PropTypes.func,
  approve: PropTypes.func,
  edit: PropTypes.func,
}

export default SponsorGrid
