'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Grid = ({listing, edit}) => {
  const rows = listing.map((value, key) => {
    return (
      <tr key={`reason-${value.id}`}>
        <td>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              edit(key)
            }}>
            <i className="fas fa-edit"></i>
          </button>
        </td>
        <td>{value.title}</td>
        <td>{value.description}</td>
        <td>{value.forceAttended === 1 ? 'Yes' : 'No'}</td>
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
            <th>Force attend</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

Grid.propTypes = {listing: PropTypes.array, edit: PropTypes.func}

export default Grid
