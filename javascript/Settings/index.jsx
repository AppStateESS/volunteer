'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
/* global currentSettings */
const Settings = ({currentSettings}) => {
  const [settings, setSettings] = useState(currentSettings)
  return (
    <div>
      <h2>Settings</h2>
      <table className="table">
        <tbody>
          <tr>
            <th>Run sponsor in kiosk mode</th>
            <td></td>
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
