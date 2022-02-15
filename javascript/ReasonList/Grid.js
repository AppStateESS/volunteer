'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Sort from '../api/Sort'

const Grid = ({listing, edit, deleteReason, sort, setSort, reverseListing}) => {
  const nextSort = (field) => {
    if (field == sort.field) {
      switch (sort.direction) {
        case 'asc':
          sort.direction = 'desc'
          reverseListing()
          return
        case 'desc':
          sort.field = null
          sort.direction = 'none'
          break
        case 'none':
          sort.direction = 'asc'
          break
      }
    } else {
      sort.field = field
      sort.direction = 'asc'
    }
    setSort({...sort})
  }

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
            <th>
              <Sort
                label="Title"
                direction={sort.field === 'title' ? sort.direction : null}
                handleClick={() => {
                  nextSort('title')
                }}
              />
            </th>
            <th>
              <div className="py-2">Description</div>
            </th>
            <th>
              <Sort
                label="Track time"
                direction={
                  sort.field === 'forceAttended' ? sort.direction : null
                }
                handleClick={() => {
                  nextSort('forceAttended')
                }}
              />
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
  deleteReason: PropTypes.func,
  sort: PropTypes.object,
  setSort: PropTypes.func,
  reverseListing: PropTypes.func,
}

export default Grid
