'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Card from '../api/Card'
import ClockInput from './ClockInput'
import NewVisitor from './NewVisitor'
import ReasonList from '../api/ReasonList'
import Overlay from '@essappstate/canopy-react-overlay'
import {
  swipeVolunteer,
  clockInReason,
  getEmail,
  saveNewVisitor,
} from '../api/Fetch'

const emailFormatCorrect = (email) => {
  const expression = /[\S]+@\S+\.\S{2,3}/
  return expression.test(String(email).toLowerCase())
}

/* global sponsor */
const Kiosk = ({sponsor}) => {
  const [error, setError] = useState('')
  const [reasonsLoaded, setReasonsLoaded] = useState(false)
  const [message, setMessage] = useState('')
  const [reasons, setReasons] = useState([])
  const [reasonId, setReasonId] = useState(0)
  const [lockInput, setLockInput] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [showVisitorModal, setShowVisitorModal] = useState(false)
  const [volunteerId, setVolunteerId] = useState(0)
  const [email, setEmail] = useState('')
  const [goodEmail, setGoodEmail] = useState(0)

  useEffect(() => {
    if (reasonId > 0) {
      clockInReason(sponsor.id, volunteerId, reasonId).then((response) => {
        if (response.data.attendanceOnly) {
          setMessage(
            'Thank you for being here today. You do not need to clock out.'
          )
        } else {
          setMessage('Thank you. Please clock out when you leave.')
        }
        setShowReasonModal(false)
        pauseAndReset()
      })
    }
  }, [reasonId])

  useEffect(() => {
    if (email.length > 0) {
      setGoodEmail(emailFormatCorrect(email) ? 1 : -1)
    }
  }, [email])

  const resetVisitor = () => {
    setEmail('')
    setGoodEmail(0)
    setShowVisitorModal(false)
  }

  const saveVisitor = (firstName, lastName) => {
    resetVisitor()
    setLockInput(true)
    const values = {
      firstName,
      lastName,
      email,
      sponsorId: sponsor.id,
      includeReasons: !reasonsLoaded,
    }
    saveNewVisitor(values).then((response) => {
      determineResponse(response)
      setLockInput(false)
    })
  }

  const pauseAndReset = () => {
    const reset = setTimeout(() => {
      setVolunteerId(0)
      setReasonId(0)
      setEmail('')
      setGoodEmail(0)
      setError('')
      setMessage('')
      setShowVisitorModal(false)
      setShowReasonModal(false)
      clearTimeout(reset)
    }, 4000)
  }

  const checkEmail = (e) => {
    const address = e.target.value
    if (!address.match(/[<>]/)) {
      setEmail(address)
    }
  }

  const sendEmail = (email) => {
    getEmail({
      email,
      sponsorId: sponsor.id,
      includeReasons: !reasonsLoaded,
    }).then((r) => {
      if (r.data.success) {
        resetVisitor()
        determineResponse(r)
      } else {
        setShowVisitorModal(true)
      }
    })
  }

  const determineResponse = (response) => {
    const {success, result} = response.data
    console.log(success)
    if (success) {
      switch (result) {
        case 'in':
          if (sponsor.attendanceOnly == 1) {
            setMessage(
              'Thank you for being with us today. You do not need to clock out.'
            )
          } else {
            setMessage(
              'Thank you for being with us today. Remember to clock out when you leave.'
            )
          }
          pauseAndReset()
          break
        case 'out':
          setMessage('Thank you, you have clocked out.')
          pauseAndReset()
          break
        case 'reason':
          if (
            reasonsLoaded === false &&
            response.data.reasons &&
            response.data.reasons.length
          ) {
            setReasonsLoaded(true)
            setReasons(response.data.reasons)
          }
          setVolunteerId(response.data.volunteerId)
          setShowReasonModal(true)
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
  }

  const sendSwipe = (studentBannerId) => {
    setLockInput(true)
    const Promise = swipeVolunteer(studentBannerId, sponsor.id, !reasonsLoaded)
    Promise.then((response) => {
      determineResponse(response)
      setLockInput(false)
    })
  }

  if (error.length > 0) {
    return <div className="alert alert-warning lead text-center">{error}</div>
  } else if (message.length > 0) {
    return <div className="alert alert-success lead text-center">{message}</div>
  } else {
    let message
    if (goodEmail === -1) {
      message = <div className="text-danger small">Check email format</div>
    } else if (goodEmail === 1) {
      message = <div className="text-success small">Email looks good!</div>
    }
    const visitorInput = (
      <div>
        <div className="input-group mb-3">
          <input
            autoComplete="off"
            type="text"
            className="form-control"
            name="email"
            value={email}
            onChange={checkEmail}
            disabled={lockInput}
          />
          <div className="input-group-append">
            <button
              className="btn btn-success"
              disabled={goodEmail !== 1}
              onClick={() => {
                sendEmail(email)
              }}>
              Go!
            </button>
          </div>
        </div>
        {message}
      </div>
    )
    return (
      <div>
        <Overlay
          show={showReasonModal}
          close={() => setShowReasonModal(false)}
          title="Reason for visit"
          width="80%">
          <ReasonList
            reasons={reasons}
            pick={(reasonId) => {
              setReasonId(reasonId)
            }}
          />
        </Overlay>
        <Overlay
          show={showVisitorModal}
          close={() => setShowVisitorModal(false)}
          title="Create your account"
          width="80%">
          <NewVisitor saveVisitor={saveVisitor} email={email} />
        </Overlay>
        <Card
          cn="mb-4"
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
        <Card
          headerColor="success"
          title="Not a student or forgot your Banner ID?"
          subtitle={
            <div className="text-center">
              Please enter your email address below.
            </div>
          }
          content={visitorInput}
        />
      </div>
    )
  }
}

Kiosk.propTypes = {sponsor: PropTypes.object}

ReactDOM.render(<Kiosk sponsor={sponsor} />, document.getElementById('Kiosk'))
