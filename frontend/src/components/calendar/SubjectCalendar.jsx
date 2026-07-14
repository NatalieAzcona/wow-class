import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import CalendarStudent from './CalendarStudent'
import CalendarProfessor from './CalendarProfessor'

const SubjectCalendar = ({ subject }) => {
  const { user } = useContext(AuthContext)
  return user.role === 'teacher'
    ? <CalendarProfessor />
    : <CalendarStudent subject={subject} />
}

export default SubjectCalendar
