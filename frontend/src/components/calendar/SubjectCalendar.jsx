import useAuth from '../../hooks/useAuth'
import React from 'react'

import CalendarStudent from './CalendarStudent'
import CalendarProfessor from './CalendarProfessor'

const SubjectCalendar = ({ subject }) => {
  const { user } = useAuth()
  return user.role === 'teacher'
    ? <CalendarProfessor />
    : <CalendarStudent subject={subject} />
}

export default SubjectCalendar
