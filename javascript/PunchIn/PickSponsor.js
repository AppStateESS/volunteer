'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {getList} from '../api/Fetch'
import Select from 'react-select'
import Card from '../api/Card'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner, faClock} from '@fortawesome/free-solid-svg-icons'

const PickSponsor = ({volunteerName, contactEmail}) => {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [sponsorId, setSponsorId] = useState(0)
  const [error, setError] = useState(false)

  const loadSponsors = () => {
    const Promise = getList('volunteer/Student/Sponsor')
    Promise.then((response) => {
      if (
        response &&
        typeof response.data === 'object' &&
        response.data.length > 0
      ) {
        setSponsors(response.data)
      } else {
        setSponsors([])
      }
    })
      .catch(() => {
        setSponsors([])
        setError(true)
      })
      .then(() => {
        setLoading(false)
      })
  }

  let title = 'Clock in'
  let sponsorList
  if (sponsors.length == 0) {
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
  const subtitle = (
    <span>Hello {volunteerName}, please choose your sponsor and clock in.</span>
  )

  if (error) {
    return (
      <div>
        <h3>Sorry</h3>An error occurred when accessing our server. Please
        contact the administrators.
      </div>
    )
  } else if (loading) {
    return (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading sponsors...
      </div>
    )
  } else {
    const content = (
      <form method="post" action="./volunteer/Student/Punch/In">
        {sponsorList}
        <p className="small text-center">
          If your sponsor is not shown,{' '}
          <a href={`mailto:${contactEmail}`}>contact us</a>.
        </p>
        <button
          type="submit"
          className="btn btn-lg btn-success btn-block mt-3 py-3"
          disabled={loading || sponsorId === 0 || sponsors.length == 0}>
          {' '}
          <FontAwesomeIcon icon={faClock} />
          &nbsp;Clock in
        </button>
      </form>
    )
    return <Card {...{title, subtitle, content}} />
  }
}

PickSponsor.propTypes = {
  volunteerName: PropTypes.string,
  contactEmail: PropTypes.string,
}

export default PickSponsor
