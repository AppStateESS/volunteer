'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'
import {
  Day,
  TimeFormat,
  ApproveButton,
  TimeOut,
  ChangeTime,
  DeleteButton,
} from './Time'

const SponsorGrid = ({listing, punchOut, approve, edit, remove}) => {
  let rows
  if (listing.length == 0) {
    rows = (
      <tr>
        <td colSpan="6">No rows found.</td>
      </tr>
    )
  } else {
    rows = listing.punches.map((value) => {
      return (
        <tr key={`row-${value.id}`}>
          <td className="d-print-none">
            {value.timeOut ? (
              <ChangeTime edit={() => edit(value)} />
            ) : (
              <span></span>
            )}
            <DeleteButton punch={value} remove={remove} />
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
            <TimeOut punch={value} punchOut={punchOut} />
          </td>
          <td>{value.attended == 1 ? 'Attended' : value.totalTime}</td>
          <td>
            <ApproveButton value={value} approve={approve} />
          </td>
        </tr>
      )
    })
  }

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th className="d-print-none">&nbsp;</th>
            <th>Volunteer/Attendee</th>
            <th>Date</th>
            <th>Clock in</th>
            <th>Clock out</th>
            <th>Total time</th>
            <th>Approved</th>
          </tr>
          {rows}
          <tr>
            <td colSpan="7" className="bg-primary text-white">
              <strong>Total time:</strong>
              &nbsp;{listing.totalTime}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

SponsorGrid.propTypes = {
  sponsor: PropTypes.object,
  listing: PropTypes.object,
  punchOut: PropTypes.func,
  approve: PropTypes.func,
  edit: PropTypes.func,
  remove: PropTypes.func,
}

export default SponsorGrid
