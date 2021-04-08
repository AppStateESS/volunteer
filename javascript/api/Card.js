'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Card = ({title, subtitle, content}) => {
  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-sm-10">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="m-0">{title}</h2>
            </div>
            <div className="card-body">
              <p className="lead">{subtitle}</p>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

export default Card
