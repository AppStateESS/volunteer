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
  deletePunch,
} from '../api/Fetch'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import Overlay from '@essappstate/canopy-react-overlay'
import Form from './Form'
import FullName from '../api/Name'

const DateRange = ({searchFrom, searchTo}) => {
  return (
    <div>
      Listing punches from <strong>{searchFrom.toDateString()}</strong> to{' '}
      <strong>{searchTo.toDateString()}</strong>
    </div>
  )
}

DateRange.propTypes = {searchFrom: PropTypes.object, searchTo: PropTypes.object}

/* global sponsorId, volunteerId */
const PunchListing = ({sponsorId, volunteerId}) => {
  const [loading, setLoading] = useState(true)
  const [sponsor, setSponsor] = useState({})
  const [volunteer, setVolunteer] = useState({})
  const [listing, setListing] = useState([])
  const [reasonList, setReasonList] = useState({})
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
  const [dateRangeString, setDateRangeString] = useState('')

  let grid
  let title

  const getFromTime = () => {
    return Math.floor(searchFrom.getTime() / 1000)
  }

  const getToTime = () => {
    return Math.floor(searchTo.getTime() / 1000)
  }

  const loadList = () => {
    setLoading(true)
    setDateRangeString(<DateRange {...{searchFrom, searchTo}} />)
    const listPromise = getList(
      `volunteer/Admin/Punch/?sponsorId=${sponsorId}&volunteerId=${volunteerId}`,
      {
        from: getFromTime(),
        to: getToTime(),
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
  }

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

  const edit = (punch) => {
    setCurrentPunch(Object.assign({}, punch))
    setShowModal(true)
  }

  const remove = (punch) => {
    deletePunch(punch.id).then(loadList)
  }

  const loadReasons = () => {
    getList('./volunteer/Admin/Reason/?sortById=true').then((response) => {
      setReasonList(response.data)
    })
  }

  useEffect(() => {
    loadReasons()
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
  }, [])

  let printButton

  if (loading) {
    grid = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else {
    if (sponsorId) {
      if (listing.length === 0) {
        grid = <div>No punches recorded for this date range.</div>
      } else {
        grid = (
          <SponsorGrid
            {...{listing, punchOut, approve, edit, remove, reasonList}}
          />
        )
        printButton = (
          <a
            target="_blank"
            rel="nofollow noreferrer"
            href={`./volunteer/Admin/CSV/?report=sponsor&sponsorId=${
              sponsor.id
            }&from=${getFromTime()}&to=${getToTime()}`}
            className="btn btn-outline-dark float-right">
            <i className="fas fa-print"></i>
          </a>
        )
      }
      title = (
        <div>
          <div>{printButton}</div>
          <h2 className="mb-1">Punches for sponsor: {sponsor.name}</h2>
        </div>
      )
    } else {
      if (listing.length === 0) {
        grid = <div>No punches recorded for this date range.</div>
      } else {
        grid = (
          <VolunteerGrid
            {...{listing, punchOut, approve, edit, remove, reasonList}}
          />
        )
        printButton = (
          <a
            target="_blank"
            rel="nofollow noreferrer"
            href={`./volunteer/Admin/CSV/?report=volunteer&volunteerId=${
              volunteer.id
            }&from=${getFromTime()}&to=${getToTime()}`}
            className="btn btn-outline-dark float-right">
            <i className="fas fa-print"></i>
          </a>
        )
      }
      title = (
        <div>
          <div>{printButton}</div>
          <h2 className="mb-1">
            Punches for volunteer:{' '}
            <FullName volunteer={volunteer} useAbbr={false} />
          </h2>
        </div>
      )
    }
  }

  return (
    <div>
      <div className="d-print-none">
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
      </div>
      <div>
        <div className="mb-3 d-print-none">
          <DatePicker
            onChange={(d) => {
              if (d.getTime() < searchTo.getTime()) {
                setSearchFrom(d)
              }
            }}
            selected={searchFrom}
          />
          <button
            className="mx-2 btn btn-outline-dark btn-sm"
            onClick={loadList}>
            Search between dates
          </button>
          <DatePicker
            onChange={(d) => {
              if (searchFrom.getTime() < d.getTime()) {
                setSearchTo(d)
              }
            }}
            selected={searchTo}
          />
        </div>
        {title}
        {dateRangeString}
        <hr />
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
