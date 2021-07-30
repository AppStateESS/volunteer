'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const OptionSelect = ({edit, sponsor, deleteSponsor, key}) => {
  const [selected, setSelected] = useState('na')

  const adminOption = (e) => {
    const {value} = e.target
    switch (value) {
      case 'edit':
        edit()
        break
      case 'delete':
        deleteSponsor()
        break
      case 'report':
        location.href = `volunteer/Admin/Sponsor/${sponsor.id}/report`
        break
      case 'waiting':
        location.href = `volunteer/Admin/Sponsor/${sponsor.id}/waiting`
        break
      case 'assignReasons':
        location.href = `volunteer/Admin/Reason/assign/?sponsorId=${sponsor.id}`
        break
      case 'log':
        location.href = `volunteer/Admin/Log?sponsorId=${sponsor.id}`
        break
    }
    setSelected('na')
  }

  const assignReasonsOption =
    sponsor.useReasons == 1 ? (
      <option value="assignReasons">Assign reasons</option>
    ) : null
  return (
    <select onChange={adminOption} value={selected} className="form-control-sm">
      <option disabled={true} value="na" className="text-center">
        - Commands -
      </option>
      <option value="edit">Edit</option>
      <option value="delete">Delete</option>
      <option value="report">Report</option>
      <option value="waiting">Waiting</option>
      {assignReasonsOption}
      <option value="log">Log</option>
    </select>
  )
}

OptionSelect.propTypes = {
  sponsor: PropTypes.object,
  edit: PropTypes.func,
  deleteSponsor: PropTypes.func,
  key: PropTypes.number,
}

export default OptionSelect
