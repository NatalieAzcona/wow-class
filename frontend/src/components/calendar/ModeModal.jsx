import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import './SlotActionModal.scss'

const ModeModal = ({ slot, onConfirm, onCancel }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const date = new Date(slot.startTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })

  return (
    <dialog ref={dialogRef} className="slot-action-modal" onClose={onCancel}>
      <div className="slot-action-modal__header">
        <span>Reservar clase</span>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="slot-action-modal__body">
        <p className="slot-action-modal__day">{date}</p>
        <div className="slot-action-modal__options">
          <button className="slot-action-modal__option" onClick={() => onConfirm('online')}>
            <div className="slot-action-modal__option-header">
              <FontAwesomeIcon icon={faVideo} className="slot-action-modal__icon" />
              <span className="slot-action-modal__label">Online</span>
            </div>
            <span className="slot-action-modal__desc">Clase por videollamada con Meet</span>
          </button>
          <button className="slot-action-modal__option" onClick={() => onConfirm('presencial')}>
            <div className="slot-action-modal__option-header">
              <FontAwesomeIcon icon={faLocationDot} className="slot-action-modal__icon" />
              <span className="slot-action-modal__label">Presencial</span>
            </div>
            <span className="slot-action-modal__desc">Solo Granada / Maracena</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ModeModal
