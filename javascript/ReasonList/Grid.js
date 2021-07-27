'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({listing, edit, deleteReason}) => {
  const rows = listing.map((value, key) => {
    return (
      <tr key={`reason-${value.id}`}>
        <td style={{width: '10%'}}>
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => {
              edit(key)
            }}>
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              deleteReason(key)
            }}>
            <i className="fas fa-trash"></i>
          </button>
        </td>
        <td>{value.title}</td>
        <td>{value.description}</td>
        <td>{value.forceAttended === 1 ? 'No' : 'Yes'}</td>
      </tr>
    )
  })
  return (
    <div>
      <table className="table table-striped">
        <tbody>
          <tr>
            <th>&nbsp;</th>
            <th>Title</th>
            <th>Description</th>
            <th>Track time</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array, edit: PropTypes.func}

export default Grid
