'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import OptionSelect from './OptionSelect'

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
