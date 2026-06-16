import React from 'react'
import SubjectCard from '../../components/subjects/SubjectCard'
import CalendarStudent from '../../components/calendar/CalendarStudent'

const StudentDashboard = () => {
  return (
  <>
    <CalendarStudent/>
    <SubjectCard subject="english" path="/english" />
    <SubjectCard subject="math" path="/math" />
  </>
  )
}


export default StudentDashboard
