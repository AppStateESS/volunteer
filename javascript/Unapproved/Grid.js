'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import FullName from '../api/Name'
import totalTime from '../api/Time.js'
import {sendApproves} from '../api/Fetch'

const Grid = ({listing, load}) => {
  const [approveList, setApproveList] = useState({})

  const approve = (punchId) => {
    const copyList = Object.assign({}, approveList)
    if (copyList[punchId]) {
      delete copyList[punchId]
    } else {
      copyList[punchId] = true
    }
    setApproveList(copyList)
  }

  const postApproves = () => {
    const promise = sendApproves(Object.keys(approveList))
    promise.then((response) => {
      if (response && response.data.success) {
        load()
      } else {
        console.log('Problem contacting server')
      }
    })
  }

  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td>
          <input
            type="checkbox"
            name="approve[]"
            value={value.id}
            onChange={() => approve(value.id)}
          />
        </td>
        <td style={{width: '20%'}}>{value.sponsorName}</td>
        <td>
          <FullName volunteer={value} useAbbr={false} />
        </td>
        <td>{dayjs(value.timeIn * 1000).format('MMM D, YYYY')}</td>
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
      <h2>Unapproved punches</h2>
      <button className="btn btn-primary mb-2" onClick={postApproves}>
        Approved checked
      </button>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th></th>
            <th>Sponsor</th>
            <th>Volunteer</th>
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
