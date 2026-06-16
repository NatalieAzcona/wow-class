import React, { useState } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.scss'


const locales = { es }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
})


const CalendarView = ({events, onSelectEvent, onSelectSlot}) => {
    const [view, setView] = useState(Views.WEEK)
    

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
        selectable={!!onSelectSlot}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
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
    </div>
  )
}

export default CalendarView
