'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Form = ({punch, close, save}) => {
  const [timeIn, setTimeIn] = useState(new Date())
  const [timeOut, setTimeOut] = useState(new Date())
  const [timeError, setTimeError] = useState(false)

  useEffect(() => {
    setTimeIn(new Date(punch.timeIn * 1000))
    setTimeOut(new Date(punch.timeOut * 1000))
  }, [punch])

  useEffect(() => {
    setTimeError(timeIn.getTime() >= timeOut.getTime() && punch.attended === 0)
  }, [timeIn, timeOut])

  let errorMessage
  if (timeError && punch.attended === 0) {
    errorMessage = (
      <div className="alert alert-danger">Clock out time must be later.</div>
    )
  }

  const reset = () => {
    setTimeIn(new Date(punch.timeIn * 1000))
    setTimeOut(new Date(punch.timeOut * 1000))
  }

  const updateTimeIn = (value) => {
    setTimeIn(value)
    if (punch.attended === 1) {
      setTimeOut(value)
    }
  }

  const updateTimeOut = (value) => {
    if (punch.attended === 0) {
      setTimeOut(value)
    }
  }

  let timeOutInput
  if (punch.attended === 0) {
    timeOutInput = (
      <tr>
        <th>Time out</th>
        <td>
          <DatePicker
            onChange={updateTimeOut}
            selected={timeOut}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </td>
      </tr>
    )
  }
  return (
    <div style={{minHeight: '450px'}}>
      {errorMessage}
      <table className="table">
        <tbody>
          <tr>
            <th>Time in</th>
            <td>
              <DatePicker
                onChange={updateTimeIn}
                selected={timeIn}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </td>
          </tr>
          {timeOutInput}
        </tbody>
      </table>

      <button
        className="btn btn-primary mr-2"
        onClick={() => save(timeIn, timeOut)}
        disabled={timeError}>
        Update punch
      </button>
      <button className="btn btn-warning mr-2" onClick={reset}>
        Reset
      </button>
      <button className="btn btn-danger" onClick={close}>
        Cancel
      </button>
    </div>
  )
}

Form.propTypes = {
  punch: PropTypes.object,
  close: PropTypes.func,
  save: PropTypes.func,
}

export default Form
