'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import BigCheckBox from '@essappstate/canopy-react-bigcheckbox'
import {saveReason} from '../api/Fetch'

const Form = ({reason, success, failure, reset, titleRef}) => {
  const [title, setTitle] = useState(reason.title)
  const [description, setDescription] = useState(reason.description)
  const [forceAttended, setForceAttended] = useState(reason.forceAttended)

  useEffect(() => {
    setTitle(reason.title)
    setDescription(reason.description)
    setForceAttended(reason.forceAttended)
  }, [reason])

  const save = () => {
    const promise = saveReason({
      id: reason.id,
      title,
      description,
      forceAttended,
    })
    promise.then((response) => {
      if (response.data.success) {
        success()
      } else {
        failure()
      }
    })
  }

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-3">
          <strong>Title</strong>
        </div>
        <div className="col-9">
          <input
            name="title"
            value={title}
            ref={titleRef}
            maxsize="50"
            placeholder="A short label identifying the reason, admin only"
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-3">
          <strong>Description</strong>
        </div>
        <div className="col-sm-9">
          <input
            name="description"
            value={description}
            maxsize="255"
            onFocus={() => {
              if (description.length === 0) {
                setDescription(title)
              }
            }}
            placeholder="Longer description of the reason, shown to users"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-3"></div>
        <div className="col-sm-9">
          <BigCheckBox
            label="Force attended only status"
            checked={forceAttended}
            handle={setForceAttended}
          />
          <p className="small">
            Checking this causes the student to receive an attended only status;
            checking them out immediately.
          </p>
        </div>
      </div>
      <button
        className="btn btn-success mr-2"
        disabled={title.length === 0 || description.length === 0}
        onClick={save}>
        Save
      </button>
      <button className="btn btn-danger" onClick={reset}>
        Cancel
      </button>
    </div>
  )
}

Form.propTypes = {
  reason: PropTypes.object,
  success: PropTypes.func,
  failure: PropTypes.func,
  reset: PropTypes.func,
}

export default Form
