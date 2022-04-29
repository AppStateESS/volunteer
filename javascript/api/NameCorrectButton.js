'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {refreshVolunteer} from './Fetch'

const NameCorrectButton = ({updateName, volunteerId}) => {
  const [complete, setComplete] = useState(false)
  const correct = () => {
    refreshVolunteer(volunteerId).then((response) => {
      updateName(response.data.name)
      setComplete(true)
    })
  }
  if (complete) {
    return (
      <div className="badge badge-success">
        Name updated. If still incorrect please notify administration.
      </div>
    )
  } else {
    return (
      <div className="badge badge-danger pointer" onClick={correct}>
        Correct my name
      </div>
    )
  }
}

NameCorrectButton.propTypes = {
  updateName: PropTypes.func,
  volunteerId: PropTypes.number,
}
export default NameCorrectButton
