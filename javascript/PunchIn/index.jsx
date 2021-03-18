'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner, faClock} from '@fortawesome/free-solid-svg-icons'

const PunchIn = () => {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [sponsorId, setSponsorId] = useState(0)

  const loadSponsors = () => {
    const Promise = getList('volunteer/Student/Sponsor/')
    Promise.then((response) => {
      setLoading(false)
      setSponsors(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  let sponsorList
  if (loading) {
    sponsorList = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading sponsors...
      </div>
    )
  } else {
    sponsorList = (
      <div>
        <select
          className="form-control"
          name="sponsorId"
          onChange={(e) => setSponsorId(e.target.value)}
          value={sponsorId}>
          <option value="0">
            -- Person, business, or organization sponsoring --
          </option>
          {sponsors.map((value) => {
            return (
              <option key={`row-${value.id}`} value={value.id}>
                {value.name}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  useEffect(() => {
    loadSponsors()
  }, [])
  return (
    <div>
      <h2>Punch in</h2>
      <form method="post" action="./volunteer/Student/Punch/In">
        {sponsorList}
        <p className="small">If your sponsor is not shown, contact us.</p>
        <button
          type="submit"
          className="btn btn-lg btn-success btn-block mt-3"
          disabled={loading || sponsorId === 0}>
          {' '}
          <FontAwesomeIcon icon={faClock} />
          &nbsp;Punch in
        </button>
      </form>
    </div>
  )
}

ReactDOM.render(<PunchIn />, document.getElementById('PunchIn'))
