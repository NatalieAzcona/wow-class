import React, { useContext, useEffect, useState } from 'react'
import CalendarView from './CalendarView'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import AvailabilityModal from './AvailabilityModal'
import DeleteEventModal from './DeleteEventModal'


const CalendarProfessor = () => {
  const [events, setEvents] = useState([])
  const {user} = useContext(AuthContext)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent ] = useState(null)


  const { data, isLoading, isError } = useQuery({
    queryKey: ['availability'],
    queryFn: () => fetch('http://localhost:3000/api/v1/availability', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
      });

  useEffect(() => {
    if (Array.isArray(data)) {
      setEvents(data.map((availability) => ({
        id: availability._id,
        start: new Date(availability.startTime),
        end: new Date(availability.endTime),
        title: 'Disponible'
      })))
    }
  }, [data])
  
  const mutation = useMutation({
    mutationFn: ({start, end, subject}) => 
      fetch("http://localhost:3000/api/v1/availability", {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({startTime: start, endTime: end, subject})
      }).then(res=> res.json()),
    onSuccess: (data) => {
      if (!events.find(e => e.id === data._id)) {
        setEvents([...events, { 
          start: new Date(data.startTime), 
          end: new Date(data.endTime), 
          title: 'Disponible',
          id: data._id 
        }        
      ])
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`http://localhost:3000/api/v1/availability/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    onSuccess: (data, id) => {
      setEvents(events.filter(e => e.id !== id))
      setSelectedEvent(null)
    }
  })

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Ocurrió un error</div>;

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end })
  }


  return (
    <div style={{ height: 600, cursor: 'pointer' }}>
      <CalendarView events={events} onSelectSlot={handleSelectSlot} onSelectEvent={setSelectedEvent} />
      {selectedSlot && <AvailabilityModal 
        dateData={selectedSlot}
        onConfirm={() => {
          mutation.mutate({ start: selectedSlot.start, end: selectedSlot.end, subject: user.subject })
          setSelectedSlot(null)
        }}
        onCancel={() => setSelectedSlot(null)}
      /> }
      {selectedEvent && <DeleteEventModal
        eventData={selectedEvent}
        onConfirm={() => deleteMutation.mutate(selectedEvent.id)}
        onCancel={() => setSelectedEvent(null)}
      />}
    </div>
  )
}


export default CalendarProfessor
