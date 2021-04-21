'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const OptionSelect = ({edit, sponsor, key, sendKiosk, sendPreApproved}) => {
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
    }
    setSelected('na')
  }
  const kioskLabel = sponsor.kioskMode ? 'Disable kiosk' : 'Enable kiosk'
  const approveLabel =
    sponsor.preApproved == 1 ? 'Do not pre-approve' : 'Pre-approve punches'
  return (
    <select onChange={adminOption} value={selected} className="btn btn-sm">
      <option disabled={true} value="na">
        - Commands -
      </option>
      <option value="edit">Edit</option>
      <option value="report">Report</option>
      <option value="kiosk">{kioskLabel}</option>
      <option value="preapproved">{approveLabel}</option>
    </select>
  )
}

OptionSelect.propTypes = {
  sponsor: PropTypes.object,
  edit: PropTypes.func,
  key: PropTypes.number,
  sendKiosk: PropTypes.func,
  sendPreApproved: PropTypes.func,
}

const Grid = ({listing, edit, sendKiosk, sendPreApproved}) => {
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
            sendPreApproved={() => sendPreApproved(key)}
          />
        </td>
        <td>{value.name}</td>
        <td>
          <a href={`./volunteer/${value.searchName}`}>{value.searchName}</a>
        </td>
        <td>{value.kioskMode ? <span>Yes</span> : <span>No</span>}</td>
        <td>{value.preApproved ? <span>Yes</span> : <span>No</span>}</td>
      </tr>
    )
  })
  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Link</th>
            <th>Kiosk mode</th>
            <th>Pre-Approve punch</th>
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
}

export default Grid
