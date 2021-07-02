'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const OptionSelect = ({
  edit,
  sponsor,
  key,
  sendKiosk,
  sendPreApproved,
  sendAttendance,
  sendUseReasons,
}) => {
  const [selected, setSelected] = useState('na')

  const adminOption = (e) => {
    const {value} = e.target
    switch (value) {
      case 'edit':
        edit(key)
        break
      case 'report':
        location.href = `volunteer/Admin/Sponsor/${sponsor.id}/report`
        break
      case 'kiosk':
        sendKiosk(key)
        break
      case 'preapproved':
        sendPreApproved(key)
        break
      case 'attendance':
        sendAttendance(key)
        break
      case 'reason':
        sendUseReasons(key)
        break
      case 'log':
        location.href = `volunteer/Admin/Log?sponsorId=${sponsor.id}`
        break
    }
    setSelected('na')
  }
  const kioskLabel = sponsor.kioskMode == 1 ? 'Disable kiosk' : 'Enable kiosk'
  const approveLabel =
    sponsor.preApproved == 1 ? 'Do not pre-approve' : 'Pre-approve punches'
  const attendanceLabel =
    sponsor.attendanceOnly == 1 ? 'Punch in/out' : 'Attendance only'
  const reasonLabel = sponsor.useReasons == 1 ? 'No reasons' : 'Use reasons'
  return (
    <select onChange={adminOption} value={selected} className="form-control-sm">
      <option disabled={true} value="na" className="text-center">
        - Commands -
      </option>
      <option value="edit">Edit</option>
      <option value="report">Report</option>
      <option value="kiosk">{kioskLabel}</option>
      <option value="preapproved">{approveLabel}</option>
      <option value="attendance">{attendanceLabel}</option>
      <option value="reason">{reasonLabel}</option>
      <option value="log">Log</option>
    </select>
  )
}

OptionSelect.propTypes = {
  sponsor: PropTypes.object,
  edit: PropTypes.func,
  key: PropTypes.number,
  sendKiosk: PropTypes.func,
  sendPreApproved: PropTypes.func,
  sendAttendance: PropTypes.func,
  sendUseReasons: PropTypes.func,
}

const Grid = ({
  listing,
  edit,
  sendKiosk,
  sendPreApproved,
  sendAttendance,
  sendUseReasons,
}) => {
  const yes = <span className="badge badge-success mr-1">Yes</span>
  const no = <span className="badge badge-danger mr-1">No</span>

  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '20%'}}>
          <OptionSelect
            edit={() => edit(key)}
            sendKiosk={() => {
              sendKiosk(key)
            }}
            sponsor={value}
            sendAttendance={() => sendAttendance(key)}
            sendPreApproved={() => sendPreApproved(key)}
            sendUseReasons={() => sendUseReasons(key)}
          />
        </td>
        <td>
          {value.name}{' '}
          <a href={`./${value.searchName}`}>
            <i className="fas fa-link"></i>
          </a>
        </td>
        <td>{value.kioskMode ? yes : no}</td>
        <td>{value.preApproved ? yes : no}</td>
        <td>{value.attendanceOnly ? yes : no}</td>
        <td>{value.useReasons ? yes : no}</td>
      </tr>
    )
  })

  const vertical = {
    writingMode: 'vertical-rl',
    textOrientation: 'sideways-right',
    width: '5%',
  }

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th colSpan="2">&nbsp;</th>
            <th style={vertical}>Kiosk mode</th>
            <th style={vertical}>Preapproved</th>
            <th style={vertical}>Attended only</th>
            <th style={vertical}>Use reasons</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {
  listing: PropTypes.array,
  edit: PropTypes.func,
  sendKiosk: PropTypes.func,
  sendPreApproved: PropTypes.func,
  sendAttendance: PropTypes.func,
  sendUseReasons: PropTypes.func,
}

export default Grid
