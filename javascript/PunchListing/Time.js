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
    return <span className="badge badge-success">Yes</span>
  } else {
    if (value.timeOut == 0) {
      return (
        <span
          className="badge badge-danger"
          title="Clock out volunteer before approving">
          No
        </span>
      )
    } else {
      return (
        <span
          className="badge badge-danger"
          onClick={() => approve(value.id)}
          onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>
          No
        </span>
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
