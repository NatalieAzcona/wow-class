import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Calendar.scss'


const locales = { es }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
})


const EventBlock = ({ event }) => {
  const parts = event.title.split(' · ')
  return (
    <div className="event-block">
      <span className="event-block__title">{parts[0]}</span>
      {parts[1] && <span className="event-block__mode">{parts[1]}</span>}
    </div>
  )
}

const CalendarView = ({ events, onSelectEvent, onSelectSlot, eventPropGetter, view, onView, date, onNavigate }) => {
  return (
    <div className="calendar-wrapper">
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={onView}
        date={date}
        onNavigate={onNavigate}
        selectable={!!onSelectSlot}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventPropGetter}
        components={{ event: EventBlock }}
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
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Sin eventos',
        }}
      />
    </div>
  )
}

export default CalendarView
