'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import FullName from '../api/Name'
import totalTime from '../api/Time.js'
import {sendApproves} from '../api/Fetch'

const Grid = ({listing, load, setListing}) => {
  const [checkAll, setCheckAll] = useState(false)

  const approve = (key) => {
    const copyList = [...listing]
    copyList[key].approved = copyList[key].approved === 1 ? 0 : 1
    setListing(copyList)
    if (checkAll) {
      setCheckAll(false)
    }
  }

  const toggleCheckAll = () => {
    const valueAll = checkAll ? false : true
    const copyList = [...listing]
    listing.forEach((value, key) => {
      value.approved = valueAll ? 1 : 0
      copyList[key] = value
    })
    setCheckAll(valueAll)
    setListing(copyList)
  }

  const postApproves = () => {
    const approveList = []
    listing.forEach((value) => {
      if (value.approved) {
        approveList.push(value.id)
      }
    })
    if (approveList.length === 0) {
      return
    }
    const promise = sendApproves(approveList)
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
          {value.timeOut != 0 ? (
            <input
              type="checkbox"
              name="approve[]"
              checked={value.approved === 1}
              value={value.id}
              onChange={() => approve(key)}
            />
          ) : (
            <span></span>
          )}
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
            <th>
              <input
                type="checkbox"
                name="approveAll"
                checked={checkAll}
                onChange={toggleCheckAll}
              />
            </th>
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

Grid.propTypes = {listing: PropTypes.array, load: PropTypes.func}

export default Grid
