'use strict'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import BigCheckBox from '@essappstate/canopy-react-bigcheckbox'
import {updateSetting} from '../api/Fetch'

/* global currentSettings */
const Settings = ({currentSettings}) => {
  const [settings, setSettings] = useState(currentSettings)

  const setValue = (name, value) => {
    const copy = Object.assign({}, settings)
    copy[name] = value
    setSettings(copy)
    updateSetting(name, value)
  }

  const setApprovalRequired = () => {
    setValue('approvalRequired', !settings.approvalRequired)
  }

  return (
    <div>
      <h2>Settings</h2>
      <div className="row">
        <div className="col-md-8 col-sm-10 mx-auto">
          <table className="table">
            <tbody>
              <tr>
                <th>Punch approval is required</th>
                <td>
                  <BigCheckBox
                    label="Approval required"
                    checked={settings.approvalRequired}
                    handle={setApprovalRequired}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <Settings currentSettings={currentSettings} />,
  document.getElementById('Settings')
)
