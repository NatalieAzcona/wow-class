import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ModeModal from './ModeModal'
import StudentReservationModal from './StudentReservationModal'
import WeekNavigator from './WeekNavigator'
import DayColumn from './DayColumn'
import { API } from '../../config/api'
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
    queryFn: () => fetch(`${API}/availability`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: reservations } = useQuery({
    queryKey: ['reservationsStudent'],
    queryFn: () => fetch(`${API}/reservation`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const bookMutation = useMutation({
    mutationFn: ({ availability, teacher, mode }) =>
      fetch(`${API}/reservation`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ availability, teacher, mode })
      }).then(res => res.json()),
    onSuccess: () => {
      setSelectedSlot(null)
      queryClient.invalidateQueries(['reservationsStudent'])
      queryClient.invalidateQueries(['availabilityStudent'])
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (reservationId) =>
      fetch(API + `/reservation/${reservationId}`, {
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
        slotDate > new Date(Date.now() + 24 * 60 * 60 * 1000)
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

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="week-picker">
      <h2 className="week-picker__title">Agenda</h2>
      <WeekNavigator
        onPrev={prevWeek}
        onNext={nextWeek}
        range={formatWeekRange()}
      />
      <div className="week-picker__grid">
        {weekDays.map((day, i) => (
          <DayColumn
            key={i}
            dayName={DAYS[i]}
            dayDate={day.getDate()}
            slots={timeSlotsForDay(day)}
            isPast={day < new Date().setHours(0, 0, 0, 0)}
            getReservationForSlot={getReservationForSlot}
            onSelect={setSelectedSlot}
            onSelectReservation={setSelectedReservation}
          />
        ))}
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
