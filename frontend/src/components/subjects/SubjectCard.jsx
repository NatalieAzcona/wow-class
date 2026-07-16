import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCalculator } from '@fortawesome/free-solid-svg-icons'
import './SubjectCard.scss'

const SubjectCard = ({ subject, path }) => {
  const names = { english: "INGLÉS", math: "MATEMÁTICAS" }
  const icons = { english: faBook, math: faCalculator }

  return (
    <Link to={path} className={`subject-card subject-card--${subject}`}>
      <div className="subject-card__icon">
        <FontAwesomeIcon icon={icons[subject]} />
      </div>
      <div className="subject-card__label">
        <h3>{names[subject]}</h3>
      </div>
    </Link>
  )
}

export default SubjectCard
