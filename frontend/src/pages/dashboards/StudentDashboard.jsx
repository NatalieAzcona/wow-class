import React from 'react'
import SubjectCard from '../../components/subjects/SubjectCard'

const StudentDashboard = () => {

  return (
  <>
    <SubjectCard subject="english" path="/subject/inglés" />
    <SubjectCard subject="math" path="/subject/matemáticas" />
  </>
  )
}


export default StudentDashboard
