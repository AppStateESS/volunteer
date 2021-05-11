import React from 'react'
import dayjs from 'dayjs'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

const punchOut = ({punch, load, sendPunchOut, edit}) => {
  if (punch.timeOut > 0) {
    return (
      <div>
        {dayjs(punch.timeOut * 1000).format('h:mm A')}
        <button className="btn btn-link" onClick={edit}>
          <FontAwesomeIcon icon={faClock} />
        </button>
      </div>
    )
  } else {
    return (
      <button
        className="btn btn-danger btn-sm"
        onClick={() => sendPunchOut(punch.id, load)}>
        Clock out
      </button>
    )
  }
}

export default punchOut
