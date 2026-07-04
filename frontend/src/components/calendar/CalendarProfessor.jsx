import React, { useContext, useState } from 'react'
import { Views } from 'react-big-calendar'
import CalendarView from './CalendarView'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import DeleteEventModal from './DeleteEventModal'
import ReservedEventModal from './ReservedEventModal'
import SlotActionModal from './SlotActionModal'

const CalendarProfessor = () => {
  const { user } = useContext(AuthContext)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState(Views.WEEK)
  const queryClient = useQueryClient()

  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: () => fetch('http://localhost:3000/api/v1/availability', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: reservationData } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => fetch('http://localhost:3000/api/v1/reservation', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('http://localhost:3000/api/v1/auth/me', {
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
      fetch('http://localhost:3000/api/v1/availability', {
        method: 'POST',
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ startTime: start, endTime: end, subject: user.subject })
      }).then(res => res.json()),
    onSuccess: () => queryClient.invalidateQueries(['availability'])
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:3000/api/v1/availability/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['availability'])
      setSelectedEvent(null)
    }
  })

  const actionMutation = useMutation({
    mutationFn: ({ id, status }) =>
      fetch(`http://localhost:3000/api/v1/reservation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations'])
      setSelectedEvent(null)
    }
  })

  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId) => fetch(`http://localhost:3000/api/v1/reservation/${reservationId}`, {
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
    mutationFn: ({ studentId, mode }) => fetch('http://localhost:3000/api/v1/reservation', {
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

  const handleSelectSlot = ({ start, end }) => {
    setSelectedTimeSlot({ start, end })
  }

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.reserved ? '#2d9d6e' : event.pending ? 'var(--color-honey)' : 'var(--color-navy-100)',
      color: event.pending ? '#333' : event.reserved ? 'white' : 'var(--color-navy)',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
    }
  })

  const priority = e => e.pending ? 0 : e.reserved ? 1 : 2
  const visibleEvents = view === Views.AGENDA
    ? events.filter(e => e.reserved || e.pending)
    : [...events].sort((a, b) => priority(a) - priority(b))

  if (isLoading) return <div>Cargando...</div>

  return (
    <div>
      <CalendarView
        events={visibleEvents}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={setSelectedEvent}
        eventPropGetter={eventPropGetter}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
      />
      <div className="calendar-legend">
        <div className="calendar-legend__item">
          <span className="calendar-legend__chip calendar-legend__chip--available">Disponible</span>
          <span className="calendar-legend__text">Elige tu horario en vista semana o mes para marcarlo como disponible</span>
        </div>
        <div className="calendar-legend__item">
          <span className="calendar-legend__chip calendar-legend__chip--pending">Pendiente</span>
          <span className="calendar-legend__text">Revisa tus solicitudes y confirma. Si es online, recuerda conectarte con Google</span>
        </div>
        <div className="calendar-legend__item">
          <span className="calendar-legend__chip calendar-legend__chip--confirmed">Confirmada</span>
          <span className="calendar-legend__text">Clase agendada. Haz clic para ver los detalles o cancelar</span>
        </div>
      </div>
      {selectedTimeSlot && (
        <SlotActionModal
          slot={selectedTimeSlot}
          existingTimeSlots={getTimeSlotsInRange(selectedTimeSlot.start, selectedTimeSlot.end)}
          onMarkAvailable={({ start, end }) => {
            createTimeSlotsFromRange(start, end)
            setSelectedTimeSlot(null)
          }}
          onScheduleMeeting={async ({ start, end, studentId, mode }) => {
            const slotRes = await fetch('http://localhost:3000/api/v1/availability', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
              body: JSON.stringify({ startTime: start, endTime: end, subject: user.subject })
            })
            const slot = await slotRes.json()
            await fetch('http://localhost:3000/api/v1/reservation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
              body: JSON.stringify({ availability: slot._id, student: studentId, mode })
            })
            queryClient.invalidateQueries(['availability'])
            queryClient.invalidateQueries(['reservations'])
            setSelectedTimeSlot(null)
          }}
          onDeleteRange={() => {
            getTimeSlotsInRange(selectedTimeSlot.start, selectedTimeSlot.end)
              .forEach(ts => deleteMutation.mutate(ts._id))
            setSelectedTimeSlot(null)
          }}
          onCancel={() => setSelectedTimeSlot(null)}
        />
      )}
      {selectedEvent && !selectedEvent.reserved && !selectedEvent.pending && (
        <DeleteEventModal
          eventData={selectedEvent}
          onConfirm={() => deleteMutation.mutate(selectedEvent.id)}
          onCancel={() => setSelectedEvent(null)}
          onSchedule={({ studentId, mode }) => scheduleMutation.mutate({ studentId, mode })}
        />
      )}
      {selectedEvent && (selectedEvent.reserved || selectedEvent.pending) && (
        <ReservedEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onCancel={(reservationId) => cancelReservationMutation.mutate(reservationId)}
          isPending={selectedEvent.pending}
          onApprove={() => actionMutation.mutate({ id: selectedEvent.reservation._id, status: 'confirmada' })}
          onReject={() => actionMutation.mutate({ id: selectedEvent.reservation._id, status: 'rechazada' })}
          googleConnected={googleConnected}
          isActing={actionMutation.isPending}
        />
      )}
    </div>
  )
}

export default CalendarProfessor
