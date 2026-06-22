import React from 'react'
import { useParams } from 'react-router-dom'
import CalendarStudent from '../calendar/CalendarStudent'



const SubjectPage = () => {

const { subject } = useParams()


  return (
    <div>
      <CalendarStudent subject={subject} />
    </div>
  )
}

export default SubjectPage
