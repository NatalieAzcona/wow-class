import React, { useContext, useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import AvailabilityModal from './AvailabilityModal'
import './calendar.scss'
import DeleteEventModal from './DeleteEventModal'


const locales = { es }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
})

const CalendarClass = () => {
  const [events, setEvents] = useState([])
  const [view, setView] = useState(Views.WEEK)
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
    if (data) {
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
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={setSelectedEvent}
        step={60}
        timeslots={1}
        min={new Date(0, 0, 0, 7, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        messages={{
          today: 'Hoy',
          previous: '<',
          next: '>',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
        }}
      />
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


export default CalendarClass
