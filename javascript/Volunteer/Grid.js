'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'
import Sort from '../api/Sort'

const Grid = ({listing, deleteVolunteer, sort, setSort, reverseListing}) => {
  const selected = 'na'

  const adminOption = (option, id) => {
    switch (option) {
      case 'report':
        location.href = `./volunteer/Admin/Volunteer/${id}/report`
        break
      case 'log':
        location.href = `./volunteer/Admin/Log/?volunteerId=${id}`
        break

      case 'delete':
        if (
          prompt(
            'Deleting this volunteer will remove all their punch information.\nType DELETE in all caps below if you wish to do so.'
          ) === 'DELETE'
        ) {
          deleteVolunteer(id)
        }
        break
    }
  }
  const nextSort = (field) => {
    if (field == sort.field) {
      switch (sort.direction) {
        case 'asc':
          sort.direction = 'desc'
          break
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

  const rows = listing.map((value) => {
    return (
      <tr key={`row-${value.id}`}>
        <td style={{width: '15%'}}>
          <select
            onChange={(e) => adminOption(e.target.value, value.id)}
            value={selected}
            className="form-control-sm">
            <option disabled={true} value="na" className="text-center">
              - Commands -
            </option>
            <option value="report">Report</option>
            <option value="log">Log</option>
            <option value="delete">Delete</option>
          </select>
        </td>
        <td>
          <FullName volunteer={value} useAbbr={false} />
        </td>
        <td>
          <a href={`mailto:${value.email}`}>{value.userName}</a>
        </td>
        <td>{value.totalVisits === 0 ? 'Never' : value.lastLog}</td>
        <td>{value.totalVisits}</td>
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
                label="Name"
                direction={sort.field === 'lastName' ? sort.direction : null}
                handleClick={() => {
                  nextSort('lastName')
                }}
              />
            </th>
            <th>
              <div className="py-2">Email</div>
            </th>
            <th>
              <Sort
                label="Last logged"
                direction={sort.field === 'lastLog' ? sort.direction : null}
                handleClick={() => {
                  nextSort('lastLog')
                }}
              />
            </th>
            <th>
              <Sort
                label="Visits"
                direction={sort.field === 'totalVisits' ? sort.direction : null}
                handleClick={() => {
                  nextSort('totalVisits')
                }}
              />
            </th>
          </tr>
          {rows}
        </tbody>
      </table>
      <div className="text-center">
        Limited to 50 rows. Search above if looking for a specific volunteer.
      </div>
    </div>
  )
}

Grid.propTypes = {
  listing: PropTypes.array,
  domain: PropTypes.string,
  deleteVolunteer: PropTypes.func,
  sort: PropTypes.object,
  setSort: PropTypes.func,
  reverseListing: PropTypes.func,
}

export default Grid
