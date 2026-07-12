import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faLocationDot } from '@fortawesome/free-solid-svg-icons'

const SlotActionSchedule = ({ slot, onScheduleMeeting, onBack }) => {
  const isFullDay = (slot.end - slot.start) >= 23 * 3600 * 1000
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedMode, setSelectedMode] = useState('online')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch('http://localhost:3000/api/v1/users/students', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
  })

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

  const handleConfirm = () => {
    if (!selectedStudentId || isSubmitting) return
    setIsSubmitting(true)
    const { start, end } = getEffectiveRange()
    onScheduleMeeting({ start, end, studentId: selectedStudentId, mode: selectedMode })
  }

  return (
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
          <FontAwesomeIcon icon={faVideo} /> Online
        </button>
        <button
          className={`slot-action-modal__mode-btn ${selectedMode === 'presencial' ? 'slot-action-modal__mode-btn--active' : ''}`}
          onClick={() => setSelectedMode('presencial')}
        >
          <FontAwesomeIcon icon={faLocationDot} /> Presencial
        </button>
      </div>
      <button
        className="slot-action-modal__confirm"
        onClick={handleConfirm}
        disabled={!selectedStudentId || isSubmitting}
      >
        Confirmar
      </button>
      <button className="slot-action-modal__back" onClick={onBack}>
        Volver
      </button>
    </div>
  )
}

export default SlotActionSchedule
