import React from 'react'
import { Link } from 'react-router-dom'
import './SubjectCard.scss'

const SubjectCard = ({subject, path}) => {

const names = { english: "Inglés", math: "Matemáticas" }

  return (
    <Link to={path}>
      <div className={`subject-card subject-card--${subject}`}>
        <div className="subject-card__image"/>
        <h3>{names[subject]}</h3>
      </div>
    </Link>
  )
}

export default SubjectCard
