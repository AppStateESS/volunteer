'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {DeleteButton, ApproveButton} from '../api/Buttons'
import {ChangeTime} from './Time'
import {Day, TimeFormat, TimeOut} from '../api/Time'
import Sort from '../api/Sort'

const VolunteerGrid = ({
  listing,
  punchOut,
  approve,
  edit,
  remove,
  sort,
  setSort,
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

  const nextSort = (field) => {
    if (field == sort.field) {
      switch (sort.direction) {
        case 'asc':
          sort.direction = 'desc'
          break
        case 'desc':
          sort.field = null
          sort.direction = 'none'
          break
        case 'none':
          sort.direction = 'asc'
          break
      }
    } else {
      sort.field = field
      sort.direction = 'asc'
    }
    setSort({...sort})
  }

  if (listing.length == 0) {
    rows = <p>No rows found.</p>
  } else {
    rows = listing.map((value, skey) => {
      const punches = value.punches.map((value) => {
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
            <td>{value.reason}</td>
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
      let deleted
      if (value.deleted) {
        deleted = <span className="badge badge-danger">Deleted</span>
      }
      return (
        <div key={`sponsor-group-${skey}`}>
          <h3>
            <a
              href={`./volunteer/Admin/Sponsor/${value.punches[0].sponsorId}/report`}>
              {value.sponsor} {deleted}
            </a>
          </h3>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th className="d-print-none" style={{width: '5%'}}></th>
                <th>
                  <Sort
                    label="Reason"
                    type="num"
                    direction={sort.field === 'reason' ? sort.direction : null}
                    handleClick={() => {
                      nextSort('reason')
                    }}
                  />
                </th>
                <th>
                  <Sort
                    label="Day"
                    type="num"
                    direction={sort.field === 'timeIn' ? sort.direction : null}
                    handleClick={() => {
                      nextSort('timeIn')
                    }}
                  />
                </th>
                <th>
                  <div className="py-2">Clock in&nbsp;/&nbsp;Clock out</div>
                </th>
                <th>
                  <Sort
                    label="Total time"
                    direction={
                      sort.field === 'totalSeconds' ? sort.direction : null
                    }
                    type="num"
                    handleClick={() => {
                      nextSort('totalSeconds')
                    }}
                  />
                </th>
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
  sort: PropTypes.object,
  setSort: PropTypes.func,
}

export default VolunteerGrid
