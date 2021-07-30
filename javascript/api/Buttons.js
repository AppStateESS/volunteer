import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

const DeleteButton = ({remove, punch}) => {
  return (
    <button
      title="Delete"
      className="btn btn-danger btn-sm"
      onClick={() => {
        if (confirm('Are you sure you want to remove this punch forever?')) {
          remove(punch)
        }
      }}>
      <FontAwesomeIcon icon={faTrash} />
    </button>
  )
}
DeleteButton.propTypes = {remove: PropTypes.func, punch: PropTypes.object}

const ApproveButton = ({value, approve}) => {
  if (value.approved) {
    return (
      <div>
        <span className="d-none d-print-inline">Yes</span>
        <span className="d-print-none badge badge-success">Yes</span>
      </div>
    )
  } else {
    if (value.timeOut == 0) {
      return (
        <div>
          <span className="d-none d-print-inline">No</span>
          <span
            className="badge badge-danger d-print-none"
            title="Clock out volunteer before approving">
            No
          </span>
        </div>
      )
    } else {
      return (
        <div>
          <span className="d-none d-print-inline">Yes</span>
          <span
            className="badge badge-danger d-print-none"
            onClick={() => approve(value.id)}
            onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>
            No
          </span>
        </div>
      )
    }
  }
}

export {DeleteButton, ApproveButton}
