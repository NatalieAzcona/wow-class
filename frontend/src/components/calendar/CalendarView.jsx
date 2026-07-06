import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
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


const EventBlock = ({ event }) => {
  const parts = event.title.split(' · ')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.3, width: '100%' }}>
      <span style={{ fontWeight: 800 }}>{parts[0]}</span>
      {parts[1] && <span style={{ fontSize: '0.75em', opacity: 0.75 }}>{parts[1]}</span>}
    </div>
  )
}

const CalendarView = ({ events, onSelectEvent, onSelectSlot, eventPropGetter, view, onView, date, onNavigate }) => {
  return (
    <div style={{ height: 600, cursor: 'pointer' }}>
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
