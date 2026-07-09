import React from 'react'

const WeekNavigator = ({ onPrev, onNext, range }) => (
  <div className="week-picker__nav">
    <button onClick={onPrev} className="week-picker__arrow">←</button>
    <span className="week-picker__range">{range}</span>
    <button onClick={onNext} className="week-picker__arrow">→</button>
  </div>
)

export default WeekNavigator
