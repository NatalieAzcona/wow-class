import React, { useEffect, useState } from 'react'
import CalendarView from './CalendarView'
import { useMutation, useQuery } from '@tanstack/react-query'
import ReservationModal from './ReservationModal'

const CalendarStudent = ({subject}) => {

const [events, setEvents] = useState([])
const [selectedEvent, setSelectedEvent ] = useState(null)


  const { data, isLoading, isError } = useQuery({
    queryKey: ['availabilityStudent'],
    queryFn: () => fetch('http://localhost:3000/api/v1/availability', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
      });

  useEffect(() => {
    if (Array.isArray(data)) {
      setEvents(data.filter(slot => slot.subject === subject).map((availability) => ({
        id: availability._id,
        start: new Date(availability.startTime),
        end: new Date(availability.endTime),
        title: 'Disponible'
      })))
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: ({availability, teacher}) => 
      fetch("http://localhost:3000/api/v1/reservation", {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({availability, teacher})
      }).then(res => res.json()),
    onSuccess: () => {
      setSelectedEvent(null)
    }
  })
  

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Ocurrió un error</div>;


  return (
    <div>
       <CalendarView events={events} onSelectEvent={setSelectedEvent} />
       {selectedEvent && <ReservationModal
        eventData={selectedEvent}
        onConfirm={() => {
          const slot = data.find(s => s._id === selectedEvent.id)
          mutation.mutate({ availability: selectedEvent.id, teacher: slot.teacher })
        }}
        onCancel={() => setSelectedEvent(null)}
      />}
    </div>
  )
}

export default CalendarStudent
