'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const totalTime = (punch) => {
  if (punch.attended) {
    return 'Attended'
  }
  const inTime = punch.timeIn * 1000
  const outTime = punch.timeOut * 1000
  const date1 = dayjs(inTime)
  if (outTime > 0) {
    const date2 = dayjs(outTime)
    const hours = date2.diff(date1, 'hour')
    const minutes = Math.floor(date2.diff(date1, 'minute') % 60)

    return `${hours} hour(s), ${minutes} minute(s)`
  } else {
    return 'N/A'
  }
}

const Day = ({time}) => {
  return <div>{dayjs(time * 1000).format('MMM D, YY')}</div>
}

Day.propTypes = {time: PropTypes.number}

const TimeFormat = ({time}) => {
  return <span>{dayjs(time * 1000).format('h:mm A')}</span>
}

TimeFormat.propTypes = {time: PropTypes.number}

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

const dayStart = (d) => {
  d.setHours(0, 0, 0, 0)
  return d
}

const dayEnd = (d) => {
  d.setHours(23, 59, 59, 999)
  return d
}

export {totalTime, Day, TimeFormat, TimeOut, dayStart, dayEnd}
