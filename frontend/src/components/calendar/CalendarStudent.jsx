import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ModeModal from './ModeModal'
import StudentReservationModal from './StudentReservationModal'
import './CalendarStudent.scss'

const getMonday = (date) => {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const CalendarStudent = ({ subject }) => {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const queryClient = useQueryClient()

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['availabilityStudent'],
    queryFn: () => fetch('http://localhost:3000/api/v1/availability', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: reservations } = useQuery({
    queryKey: ['reservationsStudent'],
    queryFn: () => fetch('http://localhost:3000/api/v1/reservation', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const bookMutation = useMutation({
    mutationFn: ({ availability, teacher, mode }) =>
      fetch('http://localhost:3000/api/v1/reservation', {
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ availability, teacher, mode })
      }).then(res => res.json()),
    onSuccess: () => {
      setSelectedSlot(null)
      queryClient.invalidateQueries(['reservationsStudent'])
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (reservationId) =>
      fetch(`http://localhost:3000/api/v1/reservation/${reservationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json()),
    onSuccess: () => {
      setSelectedReservation(null)
      queryClient.invalidateQueries(['reservationsStudent'])
    }
  })

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const timeSlotsForDay = (day) => {
    if (!Array.isArray(availabilityData)) return []
    return availabilityData.filter(slot => {
      const slotDate = new Date(slot.startTime)
      return (
        slot.subject === subject &&
        slotDate.toDateString() === day.toDateString() &&
        slotDate > new Date()
      )
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }

  const getReservationForSlot = (slotId) =>
    Array.isArray(reservations) ? reservations.find(r => r.availability === slotId) : null

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const formatWeekRange = () => {
    const opts = { day: 'numeric', month: 'short' }
    return `${weekStart.toLocaleDateString('es-ES', opts)} — ${weekEnd.toLocaleDateString('es-ES', opts)}`
  }

  const renderSlot = (slot) => {
    const time = new Date(slot.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    const reservation = getReservationForSlot(slot._id)

    if (!reservation) {
      return (
        <button key={slot._id} className="week-picker__slot" onClick={() => setSelectedSlot(slot)}>
          {time}
        </button>
      )
    }

    if (reservation.status === 'pendiente') {
      return (
        <button
          key={slot._id}
          className="week-picker__slot week-picker__slot--pending"
          onClick={() => setSelectedReservation({ slot, reservation })}
        >
          <span>{time}</span>
          <span>Solicitado</span>
        </button>
      )
    }

    if (reservation.status === 'confirmada') {
      const modeLabel = reservation.mode === 'online' ? 'Online' : 'Presencial'
      return (
        <button
          key={slot._id}
          className="week-picker__slot week-picker__slot--confirmed"
          onClick={() => setSelectedReservation({ slot, reservation })}
        >
          <span>{time}</span>
          <span>Agendado · {modeLabel}</span>
        </button>
      )
    }

    return null
  }

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="week-picker">
      <div className="week-picker__nav">
        <button onClick={prevWeek} className="week-picker__arrow">←</button>
        <span className="week-picker__range">{formatWeekRange()}</span>
        <button onClick={nextWeek} className="week-picker__arrow">→</button>
      </div>
      <div className="week-picker__grid">
        {weekDays.map((day, i) => {
          const slots = timeSlotsForDay(day)
          const isPast = day < new Date().setHours(0, 0, 0, 0)
          return (
            <div key={i} className={`week-picker__day ${isPast ? 'week-picker__day--past' : ''}`}>
              <div className="week-picker__day-header">
                <span className="week-picker__day-name">{DAYS[i]}</span>
                <span className="week-picker__day-date">{day.getDate()}</span>
              </div>
              <div className="week-picker__slots">
                {slots.length === 0
                  ? <span className="week-picker__empty">Sin disponibilidad</span>
                  : slots.map(slot => renderSlot(slot))
                }
              </div>
            </div>
          )
        })}
      </div>
      {selectedSlot && (
        <ModeModal
          slot={selectedSlot}
          onConfirm={(mode) => bookMutation.mutate({ availability: selectedSlot._id, teacher: selectedSlot.teacher, mode })}
          onCancel={() => setSelectedSlot(null)}
        />
      )}
      {selectedReservation && (
        <StudentReservationModal
          slot={selectedReservation.slot}
          reservation={selectedReservation.reservation}
          onClose={() => setSelectedReservation(null)}
          onCancel={(id) => cancelMutation.mutate(id)}
        />
      )}
    </div>
  )
}

export default CalendarStudent
