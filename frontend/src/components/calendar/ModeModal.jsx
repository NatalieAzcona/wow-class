import React, { useEffect, useRef } from 'react'
import './ModeModal.scss'

const ModeModal = ({ slot, onConfirm, onCancel }) => {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const date = new Date(slot.startTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })

  return (
    <dialog ref={dialogRef} className="mode-modal" onClose={onCancel}>
      <div className="mode-modal__header">
        <span>Reservar clase</span>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="mode-modal__body">
        <p className="mode-modal__date">{date}</p>
        <p className="mode-modal__question">¿Cómo prefieres la clase?</p>
        <div className="mode-modal__options">
          <button className="mode-modal__option mode-modal__option--online" onClick={() => onConfirm('online')}>
            <span className="mode-modal__option-icon">💻</span>
            <span className="mode-modal__option-label">Online</span>
          </button>
          <button className="mode-modal__option mode-modal__option--presencial" onClick={() => onConfirm('presencial')}>
            <span className="mode-modal__option-icon">📍</span>
            <span className="mode-modal__option-label">Presencial</span>
            <span className="mode-modal__option-note">Solo Granada / Maracena</span>
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ModeModal
