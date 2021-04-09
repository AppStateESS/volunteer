'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import PickSponsor from './PickSponsor'
import SponsorPunchIn from './SponsorPunchIn'

/* global volunteerName, defaultSponsor */

const PunchIn = ({volunteerName, defaultSponsor, contactEmail}) => {
  if (defaultSponsor) {
    return (
      <SponsorPunchIn volunteerName={volunteerName} sponsor={defaultSponsor} />
    )
  } else {
    return (
      <PickSponsor volunteerName={volunteerName} contactEmail={contactEmail} />
    )
  }
}

PunchIn.propTypes = {
  volunteerName: PropTypes.string,
  defaultSponsor: PropTypes.object,
  contactEmail: PropTypes.string,
}

ReactDOM.render(
  <PunchIn
    volunteerName={volunteerName}
    defaultSponsor={defaultSponsor}
    contactEmail={contactEmail}
  />,
  document.getElementById('PunchIn')
)
