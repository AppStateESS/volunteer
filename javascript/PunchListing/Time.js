'use strict'
import React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

const Day = ({time}) => {
  return <div>{dayjs(time * 1000).format('MMM D, YY')}</div>
}

Day.propTypes = {time: PropTypes.number}

const TimeFormat = ({time}) => {
  return <span>{dayjs(time * 1000).format('h:mm A')}</span>
}

TimeFormat.propTypes = {time: PropTypes.number}

const ApproveButton = ({value, approve}) => {
  if (value.approved) {
    return (
      <div>
        <span className="d-none d-print-inline">Yes</span>
        <span className="d-print-none badge badge-success">Yes</span>
      </div>
    )
  } else {
    if (value.timeOut == 0) {
      return (
        <div>
          <span className="d-none d-print-inline">No</span>
          <span
            className="badge badge-danger d-print-none"
            title="Clock out volunteer before approving">
            No
          </span>
        </div>
      )
    } else {
      return (
        <div>
          <span className="d-none d-print-inline">Yes</span>
          <span
            className="badge badge-danger d-print-none"
            onClick={() => approve(value.id)}
            onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>
            No
          </span>
        </div>
      )
    }
  }
}

const ChangeTime = ({edit}) => {
  return (
    <button className="btn btn-link btn-sm" onClick={edit}>
      <FontAwesomeIcon icon={faClock} />
    </button>
  )
}

ChangeTime.propTypes = {edit: PropTypes.func}

const TimeOut = ({punch, punchOut}) => {
  let content
  if (punch.timeOut) {
    content = (
      <div>
        <TimeFormat time={punch.timeOut} />
      </div>
    )
  } else {
    content = (
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          punchOut(punch.id)
        }}>
        Clock out
      </button>
    )
  }
  return content
}

export {Day, TimeFormat, ApproveButton, TimeOut, ChangeTime}
