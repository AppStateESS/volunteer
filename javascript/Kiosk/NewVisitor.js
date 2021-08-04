'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const NewVisitor = ({saveVisitor, email}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    setFirstName('')
    setLastName('')
  }, [email])

  return (
    <div className="container">
      <p>
        Since this is your first time here, please enter the information below.
      </p>
      <div className="row">
        <div className="form-group col-sm-6">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            autoComplete="off"
            className="form-control"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group col-sm-6">
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            autoComplete="off"
            className="form-control"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          className="btn btn-primary"
          disabled={firstName.length === 0 || lastName.length === 0}
          onClick={() => {
            saveVisitor(firstName, lastName)
          }}>
          Save information
        </button>
      </div>
    </div>
  )
}

NewVisitor.propTypes = {saveVisitor: PropTypes.func, email: PropTypes.string}

export default NewVisitor
