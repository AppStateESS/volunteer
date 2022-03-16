'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import BigCheckBox from '@essappstate/canopy-react-bigcheckbox'
import InputGroup from './InputGroup'
import {updateSetting} from '../api/Fetch'
import PropTypes from 'prop-types'

/* global currentSettings */
const Settings = ({currentSettings}) => {
  const [settings, setSettings] = useState(currentSettings)

  const setValue = (name, value) => {
    const copy = Object.assign({}, settings)
    copy[name] = value
    setSettings(copy)
    updateSetting(name, value)
  }

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
