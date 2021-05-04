'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {ajaxPunchOut, sendApproves} from '../api/Fetch'
import Punch from './Punch'

const sendPunchOut = (punchId, load) => {
  const promise = ajaxPunchOut(punchId)
  promise.then((response) => {
    if (response.data.success) {
      load()
    }
  })
}

const objLength = (obj) => {
  return Object.keys(obj).length
}

const Grid = ({listing, load, edit}) => {
  const [approveList, setApproveList] = useState({})

  const changeDate = (e, inOut) => {
    console.log(e)
    console.log(inOut)
  }

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
    if (objLength(approveList) > 0) {
      const promise = sendApproves(Object.keys(approveList))
      promise.then((response) => {
        if (response && response.data.success) {
          load()
        } else {
          console.log('Problem contacting server')
        }
      })
    }
  }

  const rows = listing.map((value, skey) => {
    const punches = value.punches.map((value, pkey) => {
      return (
        <Punch
          key={`punch-${value.id}`}
          edit={() => edit(skey, pkey)}
          punch={value}
          load={load}
          approve={approve}
          sendPunchOut={sendPunchOut}
        />
      )
    })
    const totalTime = (
      <tr className="bg-primary text-white">
        <td colSpan="6">
          <strong>Total time with {value.sponsor}</strong>
          &nbsp;&ndash;&nbsp;{value.totalTime}
        </td>
      </tr>
    )

    return (
      <div key={`sponsor-group-${skey}`}>
        <h3>{value.sponsor}</h3>

        <table className="table table-striped">
          <tbody>
            <tr>
              <th style={{width: '5%'}}></th>
              <th style={{width: '20%'}}>Day</th>
              <th style={{width: '20%'}}>Arrived</th>
              <th style={{width: '20%'}}>Left</th>
              <th style={{width: '25%'}}>Session length</th>
              <th style={{width: '10%'}}>Status</th>
            </tr>
            {punches}
            {totalTime}
          </tbody>
        </table>
        <hr className="my-4" />
      </div>
    )
  })

  return (
    <div>
      <button
        className="btn btn-outline-dark"
        onClick={postApproves}
        disabled={objLength(approveList) === 0}>
        Approved checked
      </button>
      <hr />
      {rows}
    </div>
  )
}

Grid.propTypes = {
  listing: PropTypes.array,
  load: PropTypes.func,
  edit: PropTypes.func,
}

export default Grid
