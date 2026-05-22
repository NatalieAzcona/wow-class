import React, { useState } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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

  const handleSelectSlot = ({ start, end }) => {
    setEvents([...events, { start, end, title: 'Disponible' }])
  }

  return (
    <div style={{ height: 600 }}>
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
    </div>
  )
}

export default CalendarClass
