import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'



const CalendarClass = (props) => {

  const locales = {
    'es': es,
  }
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })

  return (
    <div>
    <Calendar
      culture='es'
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    
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


