'use strict'
import React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

const ChangeTime = ({edit}) => {
  return (
    <button
      className="btn btn-primary btn-sm mr-1"
      onClick={edit}
      title="Change time">
      <FontAwesomeIcon icon={faClock} />
    </button>
  )
}

ChangeTime.propTypes = {edit: PropTypes.func}

export {ChangeTime}
