'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import SponsorGrid from './SponsorGrid'
import VolunteerGrid from './VolunteerGrid'
import {
  getItem,
  getList,
  ajaxPunchOut,
  sendApproves,
  updatePunch,
} from '../api/Fetch'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import Overlay from '@essappstate/canopy-react-overlay'
import Form from './Form'

/* global sponsorId, volunteerId */
const PunchListing = ({sponsorId, volunteerId}) => {
  const [loading, setLoading] = useState(true)
  const [sponsor, setSponsor] = useState({})
  const [volunteer, setVolunteer] = useState({})
  const [listing, setListing] = useState([])
  const [showModal, setShowModal] = useState(false)
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setDate(today.getDate() - 30)
  const [searchFrom, setSearchFrom] = useState(lastMonth)
  const [searchTo, setSearchTo] = useState(today)
  const [currentPunch, setCurrentPunch] = useState({
    id: 0,
    timeIn: 0,
    timeOut: 0,
  })

  let grid

  const loadList = React.useCallback(() => {
    setLoading(true)
    const listPromise = getList(
      `volunteer/Admin/Punch/?sponsorId=${sponsorId}&volunteerId=${volunteerId}`,
      {
        from: Math.floor(searchFrom.getTime() / 1000),
        to: Math.floor(searchTo.getTime() / 1000),
      }
    )
    listPromise
      .then((response) => {
        if (response.data) {
          setListing(response.data)
        } else {
          setListing([])
        }
      })
      .catch(() => {
        console.log('Error pulling listing.')
        setListing([])
      })
      .then(() => setLoading(false))
  }, [sponsorId, volunteerId, searchFrom, searchTo])

  const punchOut = (punchId) => {
    const Promise = ajaxPunchOut(punchId)
    Promise.then(() => {
      loadList()
    })
  }

  const approve = (punchId) => {
    sendApproves([punchId]).then(loadList)
  }

  const savePunch = (timeIn, timeOut) => {
    currentPunch.timeIn = timeIn.getTime() / 1000
    currentPunch.timeOut = timeOut.getTime() / 1000
    const Promise = updatePunch(currentPunch)
    Promise.then((response) => {
      if (response.data.success) {
        setCurrentPunch({id: 0, timeIn: 0, timeOut: 0})
        setShowModal(false)
        loadList()
      }
    })
  }

  const edit = (key) => {
    setCurrentPunch(Object.assign({}, listing[key]))
    setShowModal(true)
  }

  useEffect(() => {
    if (sponsorId) {
      const SponsorPromise = getItem('Admin', 'Sponsor', sponsorId)
      SponsorPromise.then((response) => {
        setSponsor(response.data)
        loadList()
      })
    } else {
      const VolunteerPromise = getItem('Admin', 'Volunteer', volunteerId)
      VolunteerPromise.then((response) => {
        setVolunteer(response.data)
        loadList()
      })
    }
  }, [sponsorId, volunteerId, loadList])

  if (loading) {
    grid = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else {
    if (sponsorId) {
      grid = <SponsorGrid {...{listing, sponsor, punchOut, approve, edit}} />
    } else {
      grid = (
        <VolunteerGrid {...{listing, volunteer, punchOut, approve, edit}} />
      )
    }
  }

  return (
    <div>
      <Overlay
        show={showModal}
        close={() => setShowModal(false)}
        width="600px"
        title="Update punch">
        <Form
          punch={currentPunch}
          close={() => setShowModal(false)}
          save={savePunch}
        />
      </Overlay>
      <div>
        <div className="mb-3">
          <DatePicker onChange={setSearchFrom} selected={searchFrom} />
          <button
            className="mx-2 btn btn-outline-dark btn-sm"
            onClick={loadList}>
            Search between dates
          </button>
          <DatePicker onChange={setSearchTo} selected={searchTo} />
        </div>
        {grid}
      </div>
    </div>
  )
}

PunchListing.propTypes = {
  sponsorId: PropTypes.number,
  volunteerId: PropTypes.number,
}

ReactDOM.render(
  <PunchListing {...{sponsorId, volunteerId}} />,
  document.getElementById('PunchListing')
)
