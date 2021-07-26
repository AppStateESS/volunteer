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
  const send = (key, type) => {
    switch (type) {
      case 'attend':
        sendAttendance(key)
        break
      case 'kiosk':
        sendKiosk(key)
        break
      case 'pre':
        sendPreApproved(key)
        break
      case 'reason':
        sendUseReasons(key)
        break
    }
  }

  const button = (key, type, answer) => {
    let cn = 'btn btn-danger btn-sm mr-1'
    if (answer === 'Yes') {
      cn = 'btn btn-success btn-sm mr-1'
    }
    return (
      <button
        className={cn}
        onClick={() => {
          send(key, type)
        }}>
        {answer}
      </button>
    )
  }

  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '20%'}}>
          <OptionSelect edit={() => edit(key)} sponsor={value} />
        </td>
        <td>
          {value.name}{' '}
          <a href={`./${value.searchName}`}>
            <i className="fas fa-link"></i>
          </a>
        </td>
        <td>
          {value.kioskMode
            ? button(key, 'kiosk', 'Yes')
            : button(key, 'kiosk', 'No')}
        </td>
        <td>
          {value.preApproved
            ? button(key, 'pre', 'Yes')
            : button(key, 'pre', 'No')}
        </td>
        <td>
          {value.attendanceOnly
            ? button(key, 'attend', 'No')
            : button(key, 'attend', 'Yes')}
        </td>
        <td>
          {value.useReasons
            ? button(key, 'reason', 'Yes')
            : button(key, 'reason', 'No')}
        </td>
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
            <th style={vertical}>Track time</th>
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
