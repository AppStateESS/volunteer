'use strict'
import React, {useState, useEffect} from 'react'

import PropTypes from 'prop-types'

const ClockInput = ({sendSwipe, lockInput}) => {
  const [bannerId, setBannerId] = useState('')

  useEffect(() => {
    if (bannerId.length === 9) {
      sendSwipe(bannerId)
      setBannerId('')
    }
  }, [bannerId, sendSwipe])

  const enterId = (e) => {
    const {value} = e.target
    if (value.length <= 9 && value.match(/^\d{1,9}$/)) {
      setBannerId(value)
    }
  }

  const input = () => {
    if (lockInput) {
      return <div className="alert alert-success">Searching...</div>
    } else {
      return (
        <div>
          <input
            maxLength="9"
            type="text"
            className="form-control"
            name="bannerId"
            value={bannerId}
            onChange={enterId}
            disabled={lockInput}
          />
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              setBannerId('')
            }}>
            Clear
          </button>
        </div>
      )
    }
  }

  return <div className="mt-4">{input()}</div>
}

ClockInput.propTypes = {sendSwipe: PropTypes.func, lockInput: PropTypes.func}

export default ClockInput
