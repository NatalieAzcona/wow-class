import React from 'react'
import { Link } from 'react-router-dom'
import './SubjectCard.scss'

const SubjectCard = ({ subject, path }) => {
  const names = { english: "INGLÉS", math: "MATEMÁTICAS" }

  return (
    <Link to={path} className={`subject-card subject-card--${subject}`}>
      <div className="subject-card__label">
        <h3>{names[subject]}</h3>
      </div>
    </Link>
  )
}

export default SubjectCard
