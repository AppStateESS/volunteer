'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

const punchOut = (punch, load, sendPunchOut, edit) => {
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

const Approved = React.memo(({approved}) => {
  return approved ? (
    <div className="badge badge-success">Approved</div>
  ) : (
    <div className="badge badge-danger">Not approved</div>
  )
})
Approved.propTypes = {approved: PropTypes.number}

const Punch = ({punch, load, approve, sendPunchOut, edit}) => {
  return (
    <tr>
      <td>
        {punch.approved == 0 && punch.timeOut > 0 ? (
          <input
            type="checkbox"
            name="approve[]"
            value={punch.id}
            onChange={() => approve(punch.id)}
          />
        ) : null}
      </td>
      <td>{dayjs(punch.timeIn * 1000).format('MMM. D, YYYY')}</td>
      <td>
        {dayjs(punch.timeIn * 1000).format('h:mm A')}&nbsp;
        {punch.timeOut > 0 ? (
          <button className="btn btn-link" onClick={edit}>
            <FontAwesomeIcon icon={faClock} />
          </button>
        ) : (
          <span></span>
        )}
      </td>
      <td>{punchOut(punch, load, sendPunchOut, edit)}</td>
      <td>{punch.totalTime}</td>
      <td>
        <Approved approved={punch.approved} />
      </td>
    </tr>
  )
}

Punch.propTypes = {
  punch: PropTypes.object,
  load: PropTypes.func,
  approve: PropTypes.func,
  sendPunchOut: PropTypes.func,
  edit: PropTypes.func,
}

export default Punch
