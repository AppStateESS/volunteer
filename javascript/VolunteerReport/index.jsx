'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Grid from './Grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {getList, updatePunch} from '../api/Fetch'
import FullName from '../api/Name'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import Overlay from '@essappstate/canopy-react-overlay'
import Form from './Form'

/* global volunteer */
const VolunteerReport = ({volunteer}) => {
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setDate(today.getDate() - 30)

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentPunch, setCurrentPunch] = useState({
    id: 0,
    timeIn: 0,
    timeOut: 0,
  })
  const [searchFrom, setSearchFrom] = useState(lastMonth)
  const [searchTo, setSearchTo] = useState(today)

  const load = () => {
    setLoading(true)
    const Promise = getList(
      `volunteer/Admin/Punch/report/?volunteerId=${volunteer.id}`,
      {
        from: Math.floor(searchFrom.getTime() / 1000),
        to: Math.floor(searchTo.getTime() / 1000),
      }
    )
    Promise.then((response) => {
      setLoading(false)
      setListing(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(load, [volunteer.id])

  const edit = (skey, pkey) => {
    setShowModal(true)
    setCurrentPunch(listing[skey].punches[pkey])
  }

  const savePunch = (timeIn, timeOut) => {
    currentPunch.timeIn = timeIn.getTime() / 1000
    currentPunch.timeOut = timeOut.getTime() / 1000
    const Promise = updatePunch(currentPunch)
    Promise.then((response) => {
      if (response.data.success) {
        setCurrentPunch({id: 0, timeIn: 0, timeOut: 0})
        setShowModal(false)
        load()
      }
    })
  }

  let content
  if (loading) {
    content = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else if (listing.length === 0) {
    content = (
      <div>
        <p>No sessions found.</p>
      </div>
    )
  } else {
    content = (
      <div>
        <Grid {...{listing, load, edit}} />
      </div>
    )
  }

  let note
  if (volunteer.preferredName.length > 0) {
    note = <div className="small mb-4">Preferred name is in parentheses.</div>
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      <Overlay
        show={showModal}
        close={closeModal}
        width="600px"
        title="Update punch">
        <Form punch={currentPunch} close={closeModal} save={savePunch} />
      </Overlay>
      <h2 className="mb-0">
        <FullName volunteer={volunteer} useAbbr={false} />
      </h2>
      {note}
      <div className="mb-3">
        <DatePicker onChange={setSearchFrom} selected={searchFrom} />
        <button className="mx-2 btn btn-outline-dark btn-sm" onClick={load}>
          Search between dates
        </button>
        <DatePicker onChange={setSearchTo} selected={searchTo} />
      </div>
      <hr />
      {content}
    </div>
  )
}

VolunteerReport.propTypes = {volunteer: PropTypes.object}

ReactDOM.render(
  <VolunteerReport volunteer={volunteer} />,
  document.getElementById('VolunteerReport')
)
