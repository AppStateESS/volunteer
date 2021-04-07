'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {ajaxPunchOut} from '../api/Fetch'

const sendPunchOut = (punchId, load) => {
  const promise = ajaxPunchOut(punchId)
  promise.then((response) => {
    if (response.data.success) {
      load()
    }
  })
}

const punchOut = (punch, load) => {
  if (punch.timeOut > 0) {
    return dayjs(punch.timeOut * 1000).format('h:mm A')
  } else {
    return (
      <button
        className="btn btn-outline-dark btn-sm"
        onClick={() => sendPunchOut(punch.id, load)}>
        Punch out
      </button>
    )
  }
}

const Punch = ({punch, load}) => {
  return (
    <tr>
      <td>{dayjs(punch.timeIn * 1000).format('MMM. D, YYYY')}</td>
      <td>{dayjs(punch.timeIn * 1000).format('h:mm A')}</td>
      <td>{punchOut(punch, load)}</td>
      <td>{punch.totalTime}</td>
    </tr>
  )
}

Punch.propTypes = {punch: PropTypes.object, load: PropTypes.func}

const Grid = ({listing, load}) => {
  const rows = listing.map((value) => {
    const punches = value.punches.map((value) => {
      return <Punch key={`row-${value.id}`} punch={value} load={load} />
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

Grid.propTypes = {listing: PropTypes.array, load: PropTypes.func}

export default Grid
