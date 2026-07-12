import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

const SlotActionMain = ({ slot, existingTimeSlots, onMarkAvailable, onDeleteRange, onGoToSchedule }) => {
  const isFullDay = (slot.end - slot.start) >= 23 * 3600 * 1000
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const getEffectiveRange = () => {
    if (!isFullDay) return { start: slot.start, end: slot.end }
    const start = new Date(slot.start)
    const [sh, sm] = startTime.split(':')
    start.setHours(parseInt(sh), parseInt(sm), 0, 0)
    const end = new Date(slot.start)
    const [eh, em] = endTime.split(':')
    end.setHours(parseInt(eh), parseInt(em), 0, 0)
    return { start, end }
  }

  return (
    <div className="slot-action-modal__options">
      {isFullDay ? (
        <div className="slot-action-modal__option slot-action-modal__option--available">
          <div className="slot-action-modal__option-header">
            <FontAwesomeIcon icon={faCalendarPlus} className="slot-action-modal__icon" />
            <span className="slot-action-modal__label">Marcar disponible</span>
          </div>
          <span className="slot-action-modal__desc">Elige el rango horario</span>
          <div className="slot-action-modal__time-row">
            <input
              type="time"
              className="slot-action-modal__time-input"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <span className="slot-action-modal__time-sep">a</span>
            <input
              type="time"
              className="slot-action-modal__time-input"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
            <button
              className="slot-action-modal__time-confirm"
              onClick={() => onMarkAvailable(getEffectiveRange())}
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="slot-action-modal__option slot-action-modal__option--available"
          onClick={() => onMarkAvailable(getEffectiveRange())}
        >
          <FontAwesomeIcon icon={faCalendarPlus} className="slot-action-modal__icon" />
          <span className="slot-action-modal__label">Marcar disponible</span>
          <span className="slot-action-modal__desc">Los estudiantes podrán reservar este horario</span>
        </button>
      )}
      <button className="slot-action-modal__option slot-action-modal__option--meeting" onClick={onGoToSchedule}>
        <FontAwesomeIcon icon={faUserPlus} className="slot-action-modal__icon" />
        <span className="slot-action-modal__label">Agendar reunión</span>
        <span className="slot-action-modal__desc">Reservar directamente con un estudiante</span>
      </button>
      {existingTimeSlots?.length > 0 && (
        <button className="slot-action-modal__option slot-action-modal__option--delete" onClick={onDeleteRange}>
          <FontAwesomeIcon icon={faTrash} className="slot-action-modal__icon" />
          <span className="slot-action-modal__label">Eliminar franjas de este rango</span>
          <span className="slot-action-modal__desc">
            {existingTimeSlots.length} franja{existingTimeSlots.length > 1 ? 's' : ''} seleccionada{existingTimeSlots.length > 1 ? 's' : ''}
          </span>
        </button>
      )}
    </div>
  )
}

export default SlotActionMain
