import React, { useContext, useState } from 'react'
import { Views } from 'react-big-calendar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import CalendarView from './CalendarView'
import CalendarLegend from './CalendarLegend'
import CalendarModals from './CalendarModals'
import GoogleCalendarBanner from './GoogleCalendarBanner'
import { API } from '../../config/api'

const CalendarProfessor = () => {
  const { user } = useContext(AuthContext)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState(Views.WEEK)
  const queryClient = useQueryClient()

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => fetch(`${API}/availability`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: reservationData } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => fetch(`${API}/reservation`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const googleConnected = meData?.googleConnected ?? false

  const now = new Date()
  const events = Array.isArray(availabilityData)
    ? availabilityData.flatMap(slot => {
        const reservation = Array.isArray(reservationData)
          ? reservationData.find(r => (r.availability?._id ?? r.availability) === slot._id)
          : null
        if (new Date(slot.startTime) < now && !reservation) return []
        const isPending = reservation?.status === 'pendiente'
        const isConfirmed = reservation?.status === 'confirmada'
        return [{
          id: slot._id,
          start: new Date(slot.startTime),
          end: new Date(slot.endTime),
          title: isConfirmed
            ? `${reservation.student?.name || 'Reservado'} · ${reservation.mode === 'online' ? 'Online' : 'Presencial'}`
            : isPending
              ? `Pendiente · ${reservation.student?.name || 'Estudiante'}`
              : 'Disponible',
          reserved: isConfirmed,
          pending: isPending,
          reservation,
        }]
      })
    : []

  const mutation = useMutation({
    mutationFn: ({ start, end }) =>
      fetch(`${API}/availability`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ startTime: start, endTime: end, subject: user.subject })
      }).then(res => res.json()),
    onSuccess: () => queryClient.invalidateQueries(['availability'])
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(API + `/availability/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    onSuccess: () => { queryClient.invalidateQueries(['availability']); setSelectedEvent(null) }
  })

  const actionMutation = useMutation({
    mutationFn: ({ id, status }) =>
      fetch(API + `/reservation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status })
      }).then(res => res.json()),
    onSuccess: () => { queryClient.invalidateQueries(['reservations']); setSelectedEvent(null) }
  })

  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId) => fetch(API + `/reservation/${reservationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations'])
      queryClient.invalidateQueries(['availability'])
      setSelectedEvent(null)
    }
  })

  const scheduleMutation = useMutation({
    mutationFn: ({ studentId, mode }) => fetch(`${API}/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ availability: selectedEvent?.id, student: studentId, mode })
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations'])
      queryClient.invalidateQueries(['availability'])
      setSelectedEvent(null)
    }
  })

  const createTimeSlotsFromRange = (start, end) => {
    const current = new Date(start)
    const endDate = new Date(end)
    while (current < endDate) {
      const next = new Date(current.getTime() + 60 * 60 * 1000)
      mutation.mutate({ start: new Date(current), end: new Date(next) })
      current.setTime(next.getTime())
    }
  }

  const getTimeSlotsInRange = (start, end) => {
    if (!Array.isArray(availabilityData)) return []
    return availabilityData.filter(ts => {
      const tsStart = new Date(ts.startTime)
      return tsStart >= new Date(start) && tsStart < new Date(end)
    })
  }

  const handleScheduleMeeting = async ({ start, end, studentId, mode }) => {
    const slotRes = await fetch(`${API}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ startTime: start, endTime: end, subject: user.subject })
    })
    const slot = await slotRes.json()
    await fetch(`${API}/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ availability: slot._id, student: studentId, mode })
    })
    queryClient.invalidateQueries(['availability'])
    queryClient.invalidateQueries(['reservations'])
    setSelectedTimeSlot(null)
  }

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.reserved ? 'var(--color-turquoise)' : event.pending ? 'var(--color-yellow)' : 'var(--color-turquoise-light)',
      color: 'var(--color-black)',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      fontSize: '0.8rem',
    }
  })

  const priority = e => e.pending ? 0 : e.reserved ? 1 : 2
  const visibleEvents = view === Views.AGENDA
    ? events.filter(e => e.reserved || e.pending)
    : [...events].sort((a, b) => priority(a) - priority(b))

  if (isLoading) return <div>Cargando...</div>

  return (
    <div>
      <GoogleCalendarBanner />
      <CalendarView
        events={visibleEvents}
        onSelectSlot={({ start, end }) => setSelectedTimeSlot({ start, end })}
        onSelectEvent={setSelectedEvent}
        eventPropGetter={eventPropGetter}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
      />
      <CalendarLegend />
      <CalendarModals
        selection={{ selectedEvent, selectedTimeSlot, setSelectedEvent, setSelectedTimeSlot }}
        mutations={{ deleteMutation, scheduleMutation, actionMutation, cancelReservationMutation }}
        handlers={{ getTimeSlotsInRange, createTimeSlotsFromRange, onScheduleMeeting: handleScheduleMeeting }}
        googleConnected={googleConnected}
      />
    </div>
  )
}

export default CalendarProfessor
