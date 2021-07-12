'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Card from '../api/Card'
import ClockInput from './ClockInput'
import ReasonList from '../api/ReasonList'
import Overlay from '@essappstate/canopy-react-overlay'
import {swipeVolunteer, clockInReason} from '../api/Fetch'

/* global sponsor */
const Kiosk = ({sponsor}) => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reasons, setReasons] = useState([])
  const [reasonId, setReasonId] = useState(0)
  const [lockInput, setLockInput] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [volunteerId, setVolunteerId] = useState(0)
  const [attended, setAttended] = useState(false)

  useEffect(() => {
    if (reasonId > 0) {
      clockInReason(sponsor.id, volunteerId, reasonId).then((response) => {
        if (response.data.attendanceOnly) {
          setMessage(
            'Thank you for being here today. You do not need to swipe out.'
          )
        } else {
          setMessage(
            'Thank you for clocking in. Please swipe again when you leave.'
          )
        }
        setShowModal(false)
        pauseAndReset()
      })
    }
  }, [reasonId])

  const pauseAndReset = () => {
    const reset = setTimeout(() => {
      setAttended(false)
      setVolunteerId(0)
      setReasonId(0)
      setError('')
      setMessage('')
      clearTimeout(reset)
    }, 4000)
  }

  const sendSwipe = (studentBannerId) => {
    setLockInput(true)
    const Promise = swipeVolunteer(studentBannerId, sponsor.id)
    Promise.then((response) => {
      const {success, result} = response.data
      if (success) {
        switch (result) {
          case 'in':
            if (sponsor.attendanceOnly == 1) {
              setMessage(
                'Thank you for being here today. You do not need to swipe out.'
              )
            } else {
              setMessage(
                'Thank you for clocking in. Remember to swipe out when you leave.'
              )
            }
            pauseAndReset()
            break
          case 'out':
            setMessage('Thank you, you have clocked out.')
            pauseAndReset()
            break
          case 'reason':
            setReasons(response.data.reasons)
            setVolunteerId(response.data.volunteerId)
            setShowModal(true)
            break
        }
      } else {
        switch (result) {
          case 'punchedInElsewhere':
            setError('You are currently clocked in elsewhere.')
            pauseAndReset()
            break
          case 'notfound':
            setError('Could not find your account. Check at the desk.')
            pauseAndReset()
            break
        }
      }
      setLockInput(false)
    })
  }

  if (error.length > 0) {
    return <div className="alert alert-warning lead text-center">{error}</div>
  } else if (message.length > 0) {
    return <div className="alert alert-success lead text-center">{message}</div>
  } else {
    return (
      <div>
        <Overlay
          show={showModal}
          close={() => setShowModal(false)}
          title="Reason for visit"
          width="80%">
          <ReasonList
            reasons={reasons}
            pick={(reasonId) => {
              setReasonId(reasonId)
            }}
          />
        </Overlay>
        <Card
          title={`Welcome to ${sponsor.name}`}
          subtitle={
            <div className="text-center">
              Please swipe your student ID card or
              <br />
              type your Banner ID number below.
            </div>
          }
          content={<ClockInput sendSwipe={sendSwipe} lockInput={lockInput} />}
        />
      </div>
    )
  }
}

Kiosk.propTypes = {sponsor: PropTypes.object}

ReactDOM.render(<Kiosk sponsor={sponsor} />, document.getElementById('Kiosk'))
