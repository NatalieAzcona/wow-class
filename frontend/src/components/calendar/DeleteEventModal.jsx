import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import './DeleteEventModal.scss'

const DeleteEventModal = ({ eventData, onConfirm, onCancel, onSchedule }) => {
  const dialogRef = useRef(null)
  const [view, setView] = useState('main')
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
  const day = new Date(eventData.start).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeRange = `de ${fmt(eventData.start)} a ${fmt(eventData.end)}`

  const handleConfirmSchedule = () => {
    if (!selectedStudentId) return
    onSchedule({ studentId: selectedStudentId, mode: selectedMode })
  }

  return (
    <dialog ref={dialogRef} className="available-slot-modal" onClose={onCancel}>
      <div className="available-slot-modal__header">
        <span>{view === 'main' ? '¿Qué quieres hacer?' : 'Agendar cita'}</span>
        <button onClick={onCancel}>✕</button>
      </div>
      <div className="available-slot-modal__body">
        <p className="available-slot-modal__day">{day}</p>
        <p className="available-slot-modal__range">{timeRange}</p>

        {view === 'main' && (
          <div className="available-slot-modal__options">
            <button
              className="available-slot-modal__option available-slot-modal__option--schedule"
              onClick={() => setView('schedule')}
            >
              <span className="available-slot-modal__icon">👤</span>
              <span className="available-slot-modal__label">Agendar cita</span>
              <span className="available-slot-modal__desc">Reservar directamente con un estudiante</span>
            </button>
            <button
              className="available-slot-modal__option available-slot-modal__option--delete"
              onClick={onConfirm}
            >
              <span className="available-slot-modal__icon">🗑️</span>
              <span className="available-slot-modal__label">Eliminar franja</span>
              <span className="available-slot-modal__desc">Quitar este horario de disponibilidad</span>
            </button>
          </div>
        )}

        {view === 'schedule' && (
          <div className="available-slot-modal__schedule">
            <label className="available-slot-modal__label-field">
              Estudiante
              <select
                className="available-slot-modal__select"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
              >
                <option value="">Selecciona un estudiante</option>
                {Array.isArray(students) && students.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label className="available-slot-modal__label-field">
              Modo
            </label>
            <div className="available-slot-modal__mode">
              <button
                className={`available-slot-modal__mode-btn ${selectedMode === 'online' ? 'available-slot-modal__mode-btn--active' : ''}`}
                onClick={() => setSelectedMode('online')}
              >
                Online
              </button>
              <button
                className={`available-slot-modal__mode-btn ${selectedMode === 'presencial' ? 'available-slot-modal__mode-btn--active' : ''}`}
                onClick={() => setSelectedMode('presencial')}
              >
                Presencial
              </button>
            </div>
            <button
              className="available-slot-modal__confirm"
              onClick={handleConfirmSchedule}
              disabled={!selectedStudentId}
            >
              Confirmar
            </button>
            <button className="available-slot-modal__back" onClick={() => setView('main')}>
              Volver
            </button>
          </div>
        )}

      </div>
    </dialog>
  )
}

export default DeleteEventModal
