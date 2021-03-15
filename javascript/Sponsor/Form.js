'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {saveSponsor} from '../api/Fetch'

const Form = ({sponsor, success, failure}) => {
  const [name, setName] = useState(sponsor.name)
  useEffect(() => {
    setName(sponsor.name)
  }, [sponsor])

  const save = () => {
    const promise = saveSponsor({id: sponsor.id, name})
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
      <div className="row">
        <div className="col-9">
          <input
            name="name"
            value={name}
            placeholder="Sponsor name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-3">
          <button
            data-dismiss="modal"
            className="btn btn-success"
            disabled={name.length === 0}
            onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

Form.propTypes = {
  sponsor: PropTypes.object,
  success: PropTypes.func,
  failure: PropTypes.func,
}

export default Form
