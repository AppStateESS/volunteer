'use strict'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {getList} from '../api/Fetch'
import Grid from './Grid'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

/* global sponsor */
const Report = ({sponsor}) => {
  const [punchList, setPunchList] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const promise = getList(`volunteer/Admin/Punch/?sponsorId=${sponsor.id}`)
    promise
      .then((response) => {
        setPunchList(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
      .then(() => setLoading(false))
  }, [sponsor.id])
  let content

  if (loading) {
    content = (
      <div className="lead text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
        &nbsp;Loading...
      </div>
    )
  } else {
    content = <Grid listing={punchList} />
  }
  return (
    <div>
      <h2>{sponsor.name}</h2>
      {content}
    </div>
  )
}

ReactDOM.render(<Report sponsor={sponsor} />, document.getElementById('Report'))
