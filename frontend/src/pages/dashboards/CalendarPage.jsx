import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import ProfessorDashboard from './ProfessorDashboard'
import CalendarStudent from '../../components/calendar/CalendarStudent'

const CalendarPage = () => {
  const { user } = useContext(AuthContext)
  if (user.role === 'teacher') return <ProfessorDashboard />
  return <CalendarStudent />
}

export default CalendarPage
