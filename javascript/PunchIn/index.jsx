'use strict'
import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import PickSponsor from './PickSponsor'
import SponsorPunchIn from './SponsorPunchIn'
import {getSponsorReasons} from '../api/Fetch'

/* global volunteerName, defaultSponsor, contactEmail */

const PunchIn = ({volunteerName, defaultSponsor, contactEmail}) => {
  const [reasons, setReasons] = useState([])
  const [reasonId, setReasonId] = useState(0)
  const formRef = useRef()

  const loadSponsorReasons = (sponsorId) => {
    getSponsorReasons(sponsorId).then((response) => {
      const reasonList = response.data
      if (reasonList.length === 0) {
        formRef.current.submit()
      } else {
        setReasons(reasonList)
      }
    })
  }

  useEffect(() => {
    if (reasonId > 0) {
      formRef.current.submit()
    }
  }, [reasonId])
  if (defaultSponsor) {
    return (
      <SponsorPunchIn
        {...{
          formRef,
          volunteerName,
          reasons,
          setReasonId,
          reasonId,
          loadSponsorReasons,
        }}
        sponsor={defaultSponsor}
      />
    )
  } else {
    return (
      <PickSponsor
        {...{
          formRef,
          volunteerName,
          reasons,
          setReasonId,
          reasonId,
          loadSponsorReasons,
        }}
        contactEmail={contactEmail}
      />
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
