'use strict'
import React, {useState, useEffect} from 'react'
import SaveButton from './SaveButton'
import axios from 'axios'
import PropTypes from 'prop-types'

const wait = (delay) => {
  const promise = new Promise((resolve) => setTimeout(resolve, delay))
  return promise
}

const save = ({name, value, start, complete}) => {
  let url = './volunteer/Admin/Settings/'
  start()
  axios({
    method: 'post',
    url,
    data: {name, value},
    timeout: 3000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }).then(() => {
    wait(1000).then(() => {
      complete()
    })
  })
}

const InputGroup = ({name, initialValue}) => {
  const [value, setValue] = useState(initialValue)
  const [disabled, setDisabled] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDisabled(value.length === 0)
  }, [value])

  const handleClick = () => {
    save({
      name,
      value,
      start: () => setSaving(true),
      complete: () => {
        setSaving(false)
        setDisabled(true)
      },
    })
  }

  return (
    <div className="input-group">
      <input
        className="form-control"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="input-group-append">
        <SaveButton disabled={disabled} saving={saving} click={handleClick} />
      </div>
    </div>
  )
}

InputGroup.propTypes = {name: PropTypes.string, initialValue: PropTypes.string}
export default InputGroup
