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
  const subtitle = (
    <p>Hello {volunteerName}, please choose your sponsor and check in.</p>
  )
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
        &nbsp;Check in
      </button>
    </form>
  )

  return <Card {...{title, subtitle, content}} />
}

PickSponsor.propTypes = {
  volunteerName: PropTypes.string,
  contactEmail: PropTypes.string,
}

export default PickSponsor
