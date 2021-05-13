'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {Day, TimeFormat, ApproveButton, TimeOut, ChangeTime} from './Time'
import FullName from '../api/Name'

const VolunteerGrid = ({volunteer, listing, punchOut, approve, edit}) => {
  let rows
  const totalTime = (value) => {
    return (
      <tr className="bg-primary text-white">
        <td colSpan="6">
          <strong>Total time with {value.sponsor}</strong>
          &nbsp;&ndash;&nbsp;{value.totalTime}
        </td>
      </tr>
    )
  }
  if (listing.length == 0) {
    rows = (
      <tr>
        <td colSpan="6">No rows found.</td>
      </tr>
    )
  } else {
    rows = listing.map((value, skey) => {
      const punches = value.punches.map((value) => {
        return (
          <tr key={`row-${value.id}`}>
            <td>
              {value.timeOut ? (
                <ChangeTime edit={() => edit(value)} />
              ) : (
                <span></span>
              )}
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
            <td>{value.totalTime}</td>
            <td>
              <ApproveButton value={value} approve={approve} />
            </td>
          </tr>
        )
      })
      return (
        <div key={`sponsor-group-${skey}`}>
          <h3>{value.sponsor}</h3>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th style={{width: '5%'}}></th>
                <th style={{width: '20%'}}>Day</th>
                <th style={{width: '20%'}}>Clock in</th>
                <th style={{width: '20%'}}>Clock out</th>
                <th style={{width: '25%'}}>Total time</th>
                <th style={{width: '10%'}}>Approved</th>
              </tr>
              {punches}
              {totalTime(value)}
            </tbody>
          </table>
          <hr className="my-4" />
        </div>
      )
    })
  }

  return (
    <div>
      <h2>
        Punches for volunteer:{' '}
        <FullName volunteer={volunteer} useAbbr={false} />
      </h2>

      {rows}
    </div>
  )
}

VolunteerGrid.propTypes = {
  volunteer: PropTypes.object,
  listing: PropTypes.array,
  punchOut: PropTypes.func,
  approve: PropTypes.func,
  edit: PropTypes.func,
}

export default VolunteerGrid
