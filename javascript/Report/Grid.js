'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {relativeTime} from 'dayjs/plugin/relativeTime'

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
  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td>
          {value.firstName} {value.lastName}
        </td>
        <td>{dayjs(value.timeIn * 1000).format('MMM D, YY')}</td>
        <td>{dayjs(value.timeIn * 1000).format('h:mm A')}</td>
        <td>
          {value.timeOut ? dayjs(value.timeOut * 1000).format('h:mm A') : 'N/A'}
        </td>
        <td>{totalTime(value)}</td>
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
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array}

export default Grid
