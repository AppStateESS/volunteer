'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import OptionSelect from './OptionSelect'

const Grid = ({
  listing,
  edit,
  deleteSponsor,
  sendKiosk,
  sendPreApproved,
  sendAttendance,
  sendUseReasons,
  sendDefault,
}) => {
  const send = (key, type) => {
    switch (type) {
      case 'default':
        sendDefault(key)
        break
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
          <OptionSelect
            edit={() => edit(key)}
            sponsor={value}
            deleteSponsor={() => deleteSponsor(key)}
          />
        </td>
        <td>
          {value.name}{' '}
          <a href={`./${value.searchName}`}>
            <i className="fas fa-link"></i>
          </a>
        </td>
        <td>
          {value.defaultFront
            ? button(key, 'default', 'Yes')
            : button(key, 'default', 'No')}
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

  const underline = {textDecoration: 'none'}

  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th colSpan="2">&nbsp;</th>
            <th style={{width: '6%'}}>
              <abbr
                style={underline}
                title="This sponsor will be the default selection for the home page">
                Default
              </abbr>
            </th>
            <th style={{width: '6%'}}>
              <abbr style={underline} title="Users scan their ID to clock in">
                Kiosk
              </abbr>
            </th>
            <th style={{width: '6%'}}>
              <abbr style={underline} title="All clock ins are preapproved">
                Preapp.
              </abbr>
            </th>
            <th style={{width: '6%'}}>
              <abbr style={underline} title="Track the time of a visit">
                Track
              </abbr>
            </th>
            <th style={{width: '6%'}}>
              <abbr style={underline} title="Use reasons on clock in">
                Reasons
              </abbr>
            </th>
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
  deleteSponsor: PropTypes.func,
  sendKiosk: PropTypes.func,
  sendPreApproved: PropTypes.func,
  sendAttendance: PropTypes.func,
  sendUseReasons: PropTypes.func,
  sendDefault: PropTypes.func,
}

export default Grid
