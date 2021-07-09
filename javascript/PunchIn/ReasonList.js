'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

const ReasonList = ({reasons, pick}) => {
  const reasonRows = reasons.map((value) => {
    return (
      <button
        className="btn btn-primary btn-block"
        key={`reason-${value.id}`}
        onClick={() => pick(value.id)}>
        {value.description}
      </button>
    )
  })
  return <div>{reasonRows}</div>
}

ReasonList.propTypes = {reasons: PropTypes.array, pick: PropTypes.func}

export default ReasonList
