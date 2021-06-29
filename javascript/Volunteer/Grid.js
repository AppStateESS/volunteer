'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import FullName from '../api/Name'

const Grid = ({listing, domain, deleteVolunteer}) => {
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
            'Deleting this volunteer will remove all their punch information.\nType DELETE below if you wish to do so.'
          ) === 'DELETE'
        ) {
          deleteVolunteer(id)
        }
        break
    }
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
