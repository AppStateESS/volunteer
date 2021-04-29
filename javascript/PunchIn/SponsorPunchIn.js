'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Card from '../api/Card'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'

const SponsorPunchIn = ({volunteerName, sponsor}) => {
  const title = <span>Clock in to {sponsor.name}</span>
  const subtitle = <p>Hello {volunteerName}, please clock in below.</p>
  const content = (
    <form method="post" action="./volunteer/Student/Punch/In">
      <input type="hidden" name="sponsorId" value={sponsor.id} />
      <button
        type="submit"
        className="btn btn-lg btn-success btn-block mt-3 py-3">
        <FontAwesomeIcon icon={faClock} />
        &nbsp;Clock in
      </button>
    </form>
  )

  return <Card {...{title, subtitle, content}} />
}

SponsorPunchIn.propTypes = {
  volunteerName: PropTypes.string,
  sponsor: PropTypes.object,
}

export default SponsorPunchIn
