'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import PickSponsor from './PickSponsor'
import SponsorPunchIn from './SponsorPunchIn'

/* global volunteerName, defaultSponsor */

const PunchIn = ({volunteerName, defaultSponsor}) => {
  if (defaultSponsor) {
    return (
      <SponsorPunchIn volunteerName={volunteerName} sponsor={defaultSponsor} />
    )
  } else {
    return <PickSponsor volunteerName={volunteerName} />
  }
}

PunchIn.propTypes = {
  volunteerName: PropTypes.string,
  defaultSponsor: PropTypes.object,
}

ReactDOM.render(
  <PunchIn volunteerName={volunteerName} defaultSponsor={defaultSponsor} />,
  document.getElementById('PunchIn')
)
