import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import './SlotActionModal.scss'

const SlotActionModal = ({ slot, existingTimeSlots, onMarkAvailable, onScheduleMeeting, onDeleteRange, onCancel }) => {
  const dialogRef = useRef(null)
  const isFullDay = (slot.end - slot.start) >= 23 * 3600 * 1000
  const [view, setView] = useState('main')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedMode, setSelectedMode] = useState('online')

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch('http://localhost:3000/api/v1/users/students', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    enabled: view === 'schedule',
  })

  const fmt = (date) => new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const day = new Date(slot.start).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

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

  const handleConfirmSchedule = () => {
    if (!selectedStudentId) return
    const { start, end } = getEffectiveRange()
    onScheduleMeeting({ start, end, studentId: selectedStudentId, mode: selectedMode })
  }

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
          <>
            <div className="slot-action-modal__options">
              {isFullDay ? (
                <div className="slot-action-modal__option slot-action-modal__option--available">
                  <div className="slot-action-modal__option-header">
                    <span className="slot-action-modal__icon">📅</span>
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
                <button className="slot-action-modal__option slot-action-modal__option--available" onClick={() => onMarkAvailable(getEffectiveRange())}>
                  <span className="slot-action-modal__icon">📅</span>
                  <span className="slot-action-modal__label">Marcar disponible</span>
                  <span className="slot-action-modal__desc">Los estudiantes podrán reservar este horario</span>
                </button>
              )}
              <button className="slot-action-modal__option slot-action-modal__option--meeting" onClick={() => setView('schedule')}>
                <span className="slot-action-modal__icon">👤</span>
                <span className="slot-action-modal__label">Agendar reunión</span>
                <span className="slot-action-modal__desc">Reservar directamente con un estudiante</span>
              </button>
              {existingTimeSlots?.length > 0 && (
                <button className="slot-action-modal__option slot-action-modal__option--delete" onClick={onDeleteRange}>
                  <span className="slot-action-modal__icon">🗑️</span>
                  <span className="slot-action-modal__label">Eliminar franjas de este rango</span>
                  <span className="slot-action-modal__desc">{existingTimeSlots.length} franja{existingTimeSlots.length > 1 ? 's' : ''} seleccionada{existingTimeSlots.length > 1 ? 's' : ''}</span>
                </button>
              )}
            </div>
          </>
        )}

        {view === 'schedule' && (
          <div className="slot-action-modal__schedule">
            {isFullDay && (
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
              </div>
            )}
            <label className="slot-action-modal__label-field">
              Estudiante
              <select
                className="slot-action-modal__select"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
              >
                <option value="">Selecciona un estudiante</option>
                {Array.isArray(students) && students.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="slot-action-modal__label-field">Modo</label>
            <div className="slot-action-modal__mode">
              <button
                className={`slot-action-modal__mode-btn ${selectedMode === 'online' ? 'slot-action-modal__mode-btn--active' : ''}`}
                onClick={() => setSelectedMode('online')}
              >
                Online
              </button>
              <button
                className={`slot-action-modal__mode-btn ${selectedMode === 'presencial' ? 'slot-action-modal__mode-btn--active' : ''}`}
                onClick={() => setSelectedMode('presencial')}
              >
                Presencial
              </button>
            </div>
            <button
              className="slot-action-modal__confirm"
              onClick={handleConfirmSchedule}
              disabled={!selectedStudentId}
            >
              Confirmar
            </button>
            <button className="slot-action-modal__back" onClick={() => setView('main')}>
              Volver
            </button>
          </div>
        )}

      </div>
    </dialog>
  )
}

export default SlotActionModal
