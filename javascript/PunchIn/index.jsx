'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Select from 'react-select'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner, faClock} from '@fortawesome/free-solid-svg-icons'

/* global volunteerName */

const PunchIn = ({volunteerName}) => {
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
  let title = 'Check in'
  let sponsorList
  if (loading) {
    sponsorList = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading sponsors...
      </div>
    )
  } else if (sponsors.length == 0) {
    title = 'Sorry'
    sponsorList = (
      <div className="alert alert-danger">
        No sponsors available. Please create sponsors in administration.
      </div>
    )
  } else {
    const options = sponsors.map((value) => {
      return {
        value: value.id,
        label: value.name,
      }
    })
    sponsorList = (
      <div>
        <Select options={options} onChange={({value}) => setSponsorId(value)} />
        <input type="hidden" name="sponsorId" value={sponsorId} />
      </div>
    )
  }

  useEffect(() => {
    loadSponsors()
  }, [])
  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-sm-10">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="m-0">{title}</h2>
            </div>
            <div className="card-body">
              <p>
                Hello {volunteerName}, please choose your sponsor and check in.
              </p>
              <form method="post" action="./volunteer/Student/Punch/In">
                {sponsorList}
                <p className="small text-center">
                  If your sponsor is not shown, contact us.
                </p>
                <button
                  type="submit"
                  className="btn btn-lg btn-success btn-block mt-3 py-3"
                  disabled={loading || sponsorId === 0 || sponsors.length == 0}>
                  {' '}
                  <FontAwesomeIcon icon={faClock} />
                  &nbsp;Check in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <PunchIn volunteerName={volunteerName} />,
  document.getElementById('PunchIn')
)
