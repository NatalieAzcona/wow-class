import React from 'react'
import TimeSlotButton from './TimeSlotButton'

const DayColumn = ({ dayName, dayDate, slots, isPast, getReservationForSlot, onSelect, onSelectReservation }) => (
  <div className={`week-picker__day ${isPast ? 'week-picker__day--past' : ''}`}>
    <div className="week-picker__day-header">
      <span className="week-picker__day-name">{dayName}</span>
      <span className="week-picker__day-date">{dayDate}</span>
    </div>
    <div className="week-picker__slots">
      {slots.length === 0
        ? <span className="week-picker__empty">Sin disponibilidad</span>
        : slots.map(slot => (
          <TimeSlotButton
            key={slot._id}
            slot={slot}
            reservation={getReservationForSlot(slot._id)}
            onSelect={onSelect}
            onSelectReservation={onSelectReservation}
          />
        ))
      }
    </div>
  </div>
)

export default DayColumn
