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

export default OptionSelect
