'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Card from '../api/Card'
/* global sponsor */
const Kiosk = ({sponsor}) => {
  return (
    <div>
      <Card
        title={`Welcome to ${sponsor.name}`}
        subtitle="Please swipe your student ID card or type your banner id number below."
        content="Clock in space"
      />
    </div>
  )
}

Kiosk.propTypes = {sponsor: PropTypes.object}

ReactDOM.render(<Kiosk sponsor={sponsor} />, document.getElementById('Kiosk'))
