'use strict'
import React, {useState, useEffect, useRef} from 'react'

import PropTypes from 'prop-types'

const ClockInput = ({sendSwipe, lockInput}) => {
  const [bannerId, setBannerId] = useState('')
  const bannerInput = useRef()

  useEffect(() => {
    if (bannerId.length === 9) {
      sendSwipe(bannerId)
      setBannerId('')
    }
  }, [bannerId])

  const focusInput = () => {
    bannerInput.current.focus()
  }

  useEffect(() => {
    focusInput()
  }, [])

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
          <div className="input-group mb-3">
            <input
              autoComplete="off"
              maxLength="9"
              type="text"
              className="form-control"
              name="bannerId"
              value={bannerId}
              ref={bannerInput}
              onChange={enterId}
              disabled={lockInput}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  setBannerId('')
                  focusInput()
                }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  return <div className="mt-4">{input()}</div>
}

ClockInput.propTypes = {sendSwipe: PropTypes.func, lockInput: PropTypes.bool}

export default ClockInput
