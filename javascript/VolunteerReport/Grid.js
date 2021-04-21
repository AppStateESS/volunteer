'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {ajaxPunchOut, sendApproves} from '../api/Fetch'

const sendPunchOut = (punchId, load) => {
  const promise = ajaxPunchOut(punchId)
  promise.then((response) => {
    if (response.data.success) {
      load()
    }
  })
}

const Approved = React.memo(({approved}) => {
  return approved ? (
    <div className="badge badge-success">Approved</div>
  ) : (
    <div className="badge badge-danger">Not approved</div>
  )
})
Approved.propTypes = {approved: PropTypes.number}

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

const Punch = ({punch, load, approve}) => {
  return (
    <tr>
      <td>
        {punch.approved == 0 ? (
          <input
            type="checkbox"
            name="approve[]"
            value={punch.id}
            onChange={() => approve(punch.id)}
          />
        ) : null}
      </td>
      <td>{dayjs(punch.timeIn * 1000).format('MMM. D, YYYY')}</td>
      <td>{dayjs(punch.timeIn * 1000).format('h:mm A')}</td>
      <td>{punchOut(punch, load)}</td>
      <td>{punch.totalTime}</td>
      <td>
        <Approved approved={punch.approved} />
      </td>
    </tr>
  )
}

Punch.propTypes = {punch: PropTypes.object, load: PropTypes.func}

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

  const rows = listing.map((value, key) => {
    const punches = value.punches.map((value) => {
      return (
        <Punch
          key={`punch-${value.id}`}
          punch={value}
          load={load}
          approve={approve}
        />
      )
    })
    return (
      <div key={`sponsor-group-${key}`}>
        <h3>{value.sponsor}</h3>

        <table className="table table-striped">
          <tbody>
            <tr>
              <th style={{width: '5%'}}></th>
              <th style={{width: '20%'}}>Day</th>
              <th style={{width: '20%'}}>Arrived</th>
              <th style={{width: '20%'}}>Left</th>
              <th style={{width: '20%'}}>Total time</th>
              <th style={{width: '15%'}}>Status</th>
            </tr>
            {punches}
          </tbody>
        </table>
      </div>
    )
  })
  return (
    <div>
      <button
        className="btn btn-outline-dark"
        onClick={() => {
          sendApproves(Object.keys(approveList))
        }}>
        Approved checked
      </button>
      {rows}
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array, load: PropTypes.func}

export default Grid
