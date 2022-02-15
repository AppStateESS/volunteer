'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'
import {DeleteButton, ApproveButton} from '../api/Buttons'
import {ChangeTime} from './Time'
import {Day, TimeFormat, TimeOut} from '../api/Time'
import Sort from '../api/Sort'

const SponsorGrid = ({
  listing,
  punchOut,
  approve,
  edit,
  remove,
  sort,
  setSort,
}) => {
  let totalPunches
  let rows

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

  totalPunches = listing.punches.length
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

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th className="d-print-none">&nbsp;</th>
            <th>
              <Sort
                label="Volunteer/Attendee"
                direction={sort.field === 'lastName' ? sort.direction : null}
                type="alpha"
                handleClick={() => {
                  nextSort('lastName')
                }}
              />
            </th>
            <th>
              <Sort
                label="Reason"
                direction={sort.field === 'reason' ? sort.direction : null}
                type="alpha"
                handleClick={() => {
                  nextSort('reason')
                }}
              />
            </th>
            <th>
              <Sort
                label="Date"
                type="num"
                direction={sort.field === 'timeIn' ? sort.direction : null}
                handleClick={() => {
                  nextSort('timeIn')
                }}
              />
            </th>
            <th>
              <div className="py-2">Clock in / out</div>
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
            <th>
              <div className="py-2">Approved</div>
            </th>
          </tr>
          {rows}
          <tr>
            <td colSpan="7" className="bg-primary text-white">
              <strong>Total time:</strong>
              &nbsp;{listing.totalTime}
              <br />
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

SponsorGrid.propTypes = {
  sponsor: PropTypes.object,
  listing: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  punchOut: PropTypes.func,
  approve: PropTypes.func,
  edit: PropTypes.func,
  remove: PropTypes.func,
  sort: PropTypes.object,
  setSort: PropTypes.func,
}

export default SponsorGrid
