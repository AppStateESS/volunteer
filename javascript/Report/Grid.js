'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import FullName from '../api/Name'
import totalTime from '../api/Time.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Grid = ({listing}) => {
  const [searchFrom, setSearchFrom] = useState(new Date())
  const [searchTo, setSearchTo] = useState(new Date())

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
      <div className="mb-3">
        <span>Search from&nbsp;</span>
        <DatePicker onChange={setSearchFrom} selected={searchFrom} />
        &nbsp;to&nbsp;
        <DatePicker onChange={setSearchTo} selected={searchTo} />
      </div>
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

Grid.propTypes = {listing: PropTypes.array}

export default Grid
