'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faList} from '@fortawesome/free-solid-svg-icons'

const Grid = ({listing, domain}) => {
  const rows = listing.map((value) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '15%'}}>
          <a
            className="btn btn-outline-dark btn-sm"
            href={`./volunteer/Admin/Volunteer/${value.id}/report`}>
            <FontAwesomeIcon icon={faList} />
            &nbsp;Report
          </a>
        </td>
        <td>
          <FullName volunteer={value} useAbbr={false} />
        </td>
        <td>
          <a href={`mailto:${value.userName}${domain}`}>{value.userName}</a>
        </td>
        <td>{value.bannerId}</td>
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
            <th>Username/Email</th>
            <th>Banner ID</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array, domain: PropTypes.string}

export default Grid
