'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const Card = ({title, subtitle, content, cn = '', headerColor = 'primary'}) => {
  return (
    <div className={`container ${cn}`}>
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-sm-10">
          <div className="card">
            <div className={`card-header bg-${headerColor} text-white`}>
              <h2 className="m-0">{title}</h2>
            </div>
            <div className="card-body">
              <div className="lead mb-2">{subtitle}</div>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cn: PropTypes.string,
}

export default Card
