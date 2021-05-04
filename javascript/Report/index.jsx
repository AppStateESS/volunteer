'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {getList} from '../api/Fetch'
import Grid from './Grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
/* global sponsor */
const Report = ({sponsor}) => {
  const today = new Date()
  const lastMonth = new Date()
  lastMonth.setDate(today.getDate() - 30)

  const [punchList, setPunchList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFrom, setSearchFrom] = useState(lastMonth)
  const [searchTo, setSearchTo] = useState(today)

  const load = () => {
    const promise = getList(`volunteer/Admin/Punch/?sponsorId=${sponsor.id}`, {
      from: Math.floor(searchFrom.getTime() / 1000),
      to: Math.floor(searchTo.getTime() / 1000),
    })
    promise
      .then((response) => {
        setPunchList(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
      .then(() => setLoading(false))
  }
  useEffect(load, [])

  let content

  if (loading) {
    content = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else if (punchList.length === 0) {
    content = <p>No sessions recorded with this sponsor.</p>
  } else {
    content = <Grid listing={punchList} />
  }
  return (
    <div>
      <h2>{sponsor.name}</h2>
      <div className="mb-3">
        <DatePicker onChange={setSearchFrom} selected={searchFrom} />
        <button className="mx-2 btn btn-outline-dark btn-sm" onClick={load}>
          Search between dates
        </button>
        <DatePicker onChange={setSearchTo} selected={searchTo} />
      </div>
      {content}
    </div>
  )
}

Report.propTypes = {sponsor: PropTypes.object}

ReactDOM.render(<Report sponsor={sponsor} />, document.getElementById('Report'))
