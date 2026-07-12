import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import SlotActionSchedule from './SlotActionSchedule'
import './SlotActionModal.scss'

const DeleteEventModal = ({ eventData, onConfirm, onCancel, onSchedule }) => {
  const dialogRef = useRef(null)
  const [view, setView] = useState('main')

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const fmt = (date) => new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const day = new Date(eventData.start).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeRange = `de ${fmt(eventData.start)} a ${fmt(eventData.end)}`

  return (
    <dialog ref={dialogRef} className="slot-action-modal" onClose={onCancel}>
      <div className="slot-action-modal__header">
        <span>{view === 'main' ? '¿Qué quieres hacer?' : 'Agendar cita'}</span>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="slot-action-modal__body">
        <p className="slot-action-modal__day">{day}</p>
        <p className="slot-action-modal__range">{timeRange}</p>

        {view === 'main' && (
          <div className="slot-action-modal__options">
            <button
              className="slot-action-modal__option slot-action-modal__option--meeting"
              onClick={() => setView('schedule')}
            >
              <FontAwesomeIcon icon={faUserPlus} className="slot-action-modal__icon" />
              <span className="slot-action-modal__label">Agendar cita</span>
              <span className="slot-action-modal__desc">Reservar directamente con un estudiante</span>
            </button>
            <button
              className="slot-action-modal__option slot-action-modal__option--delete"
              onClick={onConfirm}
            >
              <FontAwesomeIcon icon={faTrash} className="slot-action-modal__icon" />
              <span className="slot-action-modal__label">Eliminar franja</span>
              <span className="slot-action-modal__desc">Quitar este horario de disponibilidad</span>
            </button>
          </div>
        )}

        {view === 'schedule' && (
          <SlotActionSchedule
            slot={eventData}
            onScheduleMeeting={({ studentId, mode }) => onSchedule({ studentId, mode })}
            onBack={() => setView('main')}
          />
        )}

      </div>
    </dialog>
  )
}

export default DeleteEventModal
