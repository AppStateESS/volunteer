'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {
  Day,
  TimeFormat,
  ApproveButton,
  TimeOut,
  ChangeTime,
  DeleteButton,
} from './Time'

const VolunteerGrid = ({
  listing,
  punchOut,
  approve,
  edit,
  remove,
  reasonList,
}) => {
  let rows
  let totalTime
  totalTime = (value) => {
    return (
      <tr className="bg-primary text-white">
        <td colSpan="6">
          <strong>Total time with {value.sponsor}</strong>
          &nbsp;&ndash;&nbsp;{value.totalTime}
          <br />
          <span>
            <strong>Total visits:</strong> {value.punches.length}
          </span>
        </td>
      </tr>
    )
  }
  if (listing.length == 0) {
    rows = <p>No rows found.</p>
  } else {
    rows = listing.map((value, skey) => {
      const punches = value.punches.map((value) => {
        let reason = 'N/A'
        if (value.reasonId > 0) {
          reason = reasonList[value.reasonId].title
        }
        return (
          <tr key={`row-${value.id}`}>
            <td className="d-print-none" style={{width: '10%'}}>
              {value.timeOut ? (
                <ChangeTime edit={() => edit(value)} />
              ) : (
                <span></span>
              )}
              <DeleteButton punch={value} remove={remove} />
            </td>
            <td>{reason}</td>
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
            <td>
              <ApproveButton value={value} approve={approve} />
            </td>
          </tr>
        )
      })
      return (
        <div key={`sponsor-group-${skey}`}>
          <h3>
            <a
              href={`./volunteer/Admin/Sponsor/${value.punches[0].sponsorId}/report`}>
              {value.sponsor}
            </a>
          </h3>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th className="d-print-none" style={{width: '5%'}}></th>
                <th>Reason</th>
                <th>Day</th>
                <th>Clock in&nbsp;/&nbsp;Clock out</th>
                <th>Total time</th>
                <th>Approved</th>
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

  return <div>{rows}</div>
}

VolunteerGrid.propTypes = {
  volunteer: PropTypes.object,
  listing: PropTypes.array,
  punchOut: PropTypes.func,
  approve: PropTypes.func,
  edit: PropTypes.func,
  remove: PropTypes.func,
  reasonList: PropTypes.object,
}

export default VolunteerGrid
