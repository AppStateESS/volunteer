'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import InputGroup from './InputGroup'
import PropTypes from 'prop-types'

/* global currentSettings */
const Settings = ({currentSettings}) => {
  return (
    <div>
      <h2>Settings</h2>
      <table className="table">
        <tbody>
          <tr>
            <td>Contact name</td>
            <td>
              <InputGroup
                name="contactName"
                initialValue={currentSettings.contactName}
              />
            </td>
          </tr>
          <tr>
            <td>Contact email</td>
            <td>
              <InputGroup
                name="contactEmail"
                initialValue={currentSettings.contactEmail}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.render(
  <Settings currentSettings={currentSettings} />,
  document.getElementById('Settings')
)
Settings.propTypes = {
  currentSettings: PropTypes.object,
}
