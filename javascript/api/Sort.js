'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Sort = ({direction, handleClick, label}) => {
  if (direction === undefined || direction === null) {
    direction = 'none'
  }
  const sortIcons = {
    asc: 'sort-alpha-up',
    desc: 'sort-alpha-down-alt',
    none: 'sort',
  }

  return (
    <span className="btn btn-light" onClick={handleClick}>
      {label} <FontAwesomeIcon icon={sortIcons[direction]} />
    </span>
  )
}

Sort.propTypes = {
  direction: PropTypes.string,
  handleClick: PropTypes.func,
  label: PropTypes.string,
}
export default Sort
