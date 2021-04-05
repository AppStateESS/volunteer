'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const Punch = ({punch}) => {
  return (
    <tr>
      <td>{dayjs(punch.timeIn * 1000).format('MMM. D, YYYY')}</td>
      <td>{dayjs(punch.timeIn * 1000).format('h:mm A')}</td>
      <td>{dayjs(punch.timeOut * 1000).format('h:mm A')}</td>
      <td>{punch.totalTime}</td>
    </tr>
  )
}

Punch.propTypes = {punch: PropTypes.object}

const Grid = ({listing}) => {
  const rows = listing.map((value) => {
    const punches = value.punches.map((value) => {
      return <Punch key={`row-${value.id}`} punch={value} />
    })
    return (
      <div key={`row-${value.id}`}>
        <h3>{value.sponsor}</h3>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>Day</th>
              <th>Arrived</th>
              <th>Left</th>
              <th>Total time</th>
            </tr>
            {punches}
          </tbody>
        </table>
      </div>
    )
  })
  return <div>{rows}</div>
}

Grid.propTypes = {listing: PropTypes.array}

export default Grid
