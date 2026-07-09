import React from 'react'

const TimeSlotButton = ({ slot, reservation, onSelect, onSelectReservation }) => {
  const time = new Date(slot.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  if (!reservation) {
    return (
      <button className="week-picker__slot" onClick={() => onSelect(slot)}>
        {time}
      </button>
    )
  }

  if (reservation.status === 'pendiente') {
    return (
      <button
        className="week-picker__slot week-picker__slot--pending"
        onClick={() => onSelectReservation({ slot, reservation })}
      >
        <span>{time}</span>
        <span>Solicitado · {reservation.mode === 'online' ? 'Online' : 'Presencial'}</span>
      </button>
    )
  }

  if (reservation.status === 'confirmada') {
    return (
      <button
        className="week-picker__slot week-picker__slot--confirmed"
        onClick={() => onSelectReservation({ slot, reservation })}
      >
        <span>{time}</span>
        <span>Agendado · {reservation.mode === 'online' ? 'Online' : 'Presencial'}</span>
      </button>
    )
  }

  return null
}

export default TimeSlotButton
