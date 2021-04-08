'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'

const Grid = ({listing, edit}) => {
  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '20%'}}>
          <button
            className="btn btn-success btn-sm mr-2"
            onClick={() => {
              edit(key)
            }}>
            <FontAwesomeIcon icon={faEdit} />
            &nbsp; Edit
          </button>
          <a
            className="btn btn-outline-dark btn-sm"
            href={`volunteer/Admin/Sponsor/${value.id}/report`}>
            Reports
          </a>
        </td>
        <td>{value.name}</td>
        <td>
          <a href={`./volunteer/${value.searchName}`}>{value.searchName}</a>
        </td>
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
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array, edit: PropTypes.func}

export default Grid
