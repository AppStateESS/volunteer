'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import FullName from '../api/Name'
import totalTime from '../api/Time.js'

const Grid = ({listing, approve}) => {
  const ApproveButton = (value) => {
    if (value.approved) {
      return <span className="badge badge-success">Yes</span>
    } else {
      if (value.timeOut == 0) {
        return (
          <span
            className="badge badge-danger"
            title="Clock out volunteer before approving">
            No
          </span>
        )
      } else {
        return (
          <span
            className="badge badge-danger"
            onClick={() => approve(key)}
            onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>
            No
          </span>
        )
      }
    }
  }

  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td>
          <a href={`./volunteer/Admin/Volunteer/${value.volunteerId}/report`}>
            <FullName volunteer={value} useAbbr={false} />
          </a>
        </td>
        <td>{dayjs(value.timeIn * 1000).format('MMM D, YY')}</td>
        <td>{dayjs(value.timeIn * 1000).format('h:mm A')}</td>
        <td>
          {value.timeOut ? (
            dayjs(value.timeOut * 1000).format('h:mm A')
          ) : (
            <span className="text-danger">N/A</span>
          )}
        </td>
        <td>{totalTime(value)}</td>
        <td>
          <ApproveButton {...value} />
        </td>
      </tr>
    )
  })
  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Day</th>
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

Grid.propTypes = {listing: PropTypes.array, approve: PropTypes.func}

export default Grid
