'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'

const Grid = ({listing, edit}) => {
  const rows = listing.map((value, key) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '10%'}}>
          <button
            className="btn btn-success btn-sm"
            onClick={() => {
              edit(key)
            }}>
            <FontAwesomeIcon icon={faEdit} />
            &nbsp; Edit
          </button>
        </td>
        <td>{value.name}</td>
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
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array}

export default Grid
