import React, { useEffect, useRef, useState } from 'react'
import SlotActionMain from './SlotActionMain'
import SlotActionSchedule from './SlotActionSchedule'
import './SlotActionModal.scss'

const SlotActionModal = ({ slot, existingTimeSlots, onMarkAvailable, onScheduleMeeting, onDeleteRange, onCancel }) => {
  const dialogRef = useRef(null)
  const [view, setView] = useState('main')
  const isFullDay = (slot.end - slot.start) >= 23 * 3600 * 1000
  const day = new Date(slot.start).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fmt = (date) => new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} className="slot-action-modal" onClose={onCancel}>
      <div className="slot-action-modal__header">
        <span>{view === 'main' ? '¿Qué quieres hacer?' : 'Agendar cita'}</span>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="slot-action-modal__body">
        <p className="slot-action-modal__day">{day}</p>
        {!isFullDay && (
          <p className="slot-action-modal__range">{`de ${fmt(slot.start)} a ${fmt(slot.end)}`}</p>
        )}
        {view === 'main' && (
          <SlotActionMain
            slot={slot}
            existingTimeSlots={existingTimeSlots}
            onMarkAvailable={onMarkAvailable}
            onDeleteRange={onDeleteRange}
            onGoToSchedule={() => setView('schedule')}
          />
        )}
        {view === 'schedule' && (
          <SlotActionSchedule
            slot={slot}
            onScheduleMeeting={onScheduleMeeting}
            onBack={() => setView('main')}
          />
        )}
      </div>
    </dialog>
  )
}

export default SlotActionModal
