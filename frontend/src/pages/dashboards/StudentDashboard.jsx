import React from 'react'
import SubjectCard from '../../components/subjects/SubjectCard'
import Calendar from '../../components/calendar/CalendarClass'

const StudentDashboard = () => {
  return (
  <>
    <Calendar/>
    <SubjectCard subject="english" path="/english" />
    <SubjectCard subject="math" path="/math" />
  </>
  )
}


export default StudentDashboard
