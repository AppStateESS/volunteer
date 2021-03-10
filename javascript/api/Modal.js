'use strict'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const Modal = ({modalId, title, content, onClose}) => {
  useEffect(() => {
    $('#' + modalId).on('hidden.bs.modal', () => {
      onClose()
    })
  }, [])
  return (
    <div id={modalId} className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {}

export default Modal
