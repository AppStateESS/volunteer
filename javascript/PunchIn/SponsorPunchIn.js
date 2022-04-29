'use strict'
import React, {useState, Fragment} from 'react'
import PropTypes from 'prop-types'
import Card from '../api/Card'
import Overlay from '@essappstate/canopy-react-overlay'
import ReasonList from '../api/ReasonList'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClock} from '@fortawesome/free-solid-svg-icons'
import NameCorrectButton from '../api/NameCorrectButton.js'

const SponsorPunchIn = ({
  volunteerId,
  volunteerName,
  sponsor,
  loadSponsorReasons,
  reasonId,
  reasons,
  setReasonId,
  formRef,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState(volunteerName)

  const title = <span>Clock in to {sponsor.name}</span>
  const subtitle = <p>Hello {name}, please clock in below.</p>

  const submitCheckIn = () => {
    if (sponsor.useReasons === 1) {
      loadSponsorReasons(
        sponsor.id,
        () => setShowModal(true),
        () => formRef.current.submit()
      )
    } else {
      formRef.current.submit()
    }
  }

  const content = (
    <div>
      <Overlay
        show={showModal}
        close={() => setShowModal(false)}
        title="Reason for visit"
        width="80%">
        <Fragment>
          <ReasonList
            reasons={reasons}
            pick={(reasonId) => {
              setReasonId(reasonId)
            }}
          />
        </Fragment>
      </Overlay>
      <form method="post" action="./volunteer/Student/Punch/In" ref={formRef}>
        <input type="hidden" name="sponsorId" value={sponsor.id} />
        <input type="hidden" name="reasonId" value={reasonId} />
        <button
          type="button"
          onClick={submitCheckIn}
          className="btn btn-lg btn-success btn-block mt-3 py-3">
          <FontAwesomeIcon icon={faClock} />
          &nbsp;Clock in
        </button>
      </form>
      <NameCorrectButton updateName={setName} volunteerId={volunteerId} />
    </div>
  )

  return <Card {...{title, subtitle, content}} />
}

SponsorPunchIn.propTypes = {
  volunteerName: PropTypes.string,
  volunteerId: PropTypes.number,
  sponsor: PropTypes.object,
  reason: PropTypes.object,
  loadSponsorReasons: PropTypes.func,
  reasonId: PropTypes.number,
  reasons: PropTypes.array,
  setReasonId: PropTypes.func,
  formRef: PropTypes.object,
}

export default SponsorPunchIn
