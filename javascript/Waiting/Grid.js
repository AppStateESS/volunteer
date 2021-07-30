'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {DeleteButton} from '../api/Buttons'
import FullName from '../api/Name'
import {Day, TimeFormat, TimeOut} from '../api/Time'

const Grid = ({listing, punchOut, remove, reasonList}) => {
  let totalPunches = listing.length
  let rows
  if (listing.length === 0) {
    rows = (
      <tr>
        <td colSpan="4">No one currently waiting.</td>
      </tr>
    )
  } else {
    rows = listing.map((value) => {
      let reason
      if (value.reasonId > 0) {
        reason = reasonList[value.reasonId].title
      }
      return (
        <tr key={`row-${value.id}`}>
          <td className="d-print-none">
            <DeleteButton punch={value} remove={remove} />
          </td>
          <td>
            <a href={`./volunteer/Admin/Volunteer/${value.volunteerId}/report`}>
              <FullName volunteer={value} useAbbr={false} />
            </a>
            <br />
            <span className="small">{reason}</span>
          </td>
          <td>
            <Day time={value.timeIn} />
          </td>
          <td>
            <TimeFormat time={value.timeIn} />
            {value.attended ? (
              ''
            ) : (
              <span>
                &nbsp;/&nbsp;
                <TimeOut punch={value} punchOut={punchOut} />
              </span>
            )}
          </td>
          <td>{value.attended == 1 ? 'Attended' : value.totalTime}</td>
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
            <th>Name / Reason</th>
            <th>Date</th>
            <th>Clock in / out</th>
            <th>Visit length</th>
          </tr>
          {rows}
          <tr>
            <td colSpan="6" className="bg-primary text-white">
              <span>
                <strong>Total visits:</strong> {totalPunches}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {
  listing: PropTypes.array,
  punchOut: PropTypes.func,
  remove: PropTypes.func,
  reasonList: PropTypes.object,
}

export default Grid
