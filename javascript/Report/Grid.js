'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import FullName from '../api/Name'

const totalTime = (punch) => {
  const inTime = punch.timeIn * 1000
  const outTime = punch.timeOut * 1000
  const date1 = dayjs(inTime)
  if (outTime > 0) {
    const date2 = dayjs(outTime)
    const hours = date2.diff(date1, 'hour')
    const minutes = date2.diff(date1, 'minute')

    return `${hours} hour(s), ${minutes} minute(s)`
  } else {
    return 'N/A'
  }
}

const Grid = ({listing}) => {
  const rows = listing.map((value) => {
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
          {value.timeOut ? dayjs(value.timeOut * 1000).format('h:mm A') : 'N/A'}
        </td>
        <td>{totalTime(value)}</td>
        <td>{value.approved ? 'Yes' : 'No'}</td>
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
            <th>Status</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array}

export default Grid
