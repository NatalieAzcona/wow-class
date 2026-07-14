import React from 'react'

const CalendarLegend = () => (
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
)

export default CalendarLegend
