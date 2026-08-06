import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faStar } from '@fortawesome/free-solid-svg-icons'
import ModuleCardMenu from './ModuleCardMenu'
import './ModuleCard.scss'

const ModuleCard = ({ module, subject, level, isTeacher, isLocked, isCompleted, isPlanLocked }) => {
  if (isPlanLocked) {
    return (
      <Link to="/dashboard/plans" className="module-card module-card--plan-locked">
        <span className="module-card__num">{module.order}</span>
        <span className="module-card__title">{module.title}</span>
        <FontAwesomeIcon icon={faStar} className="module-card__plan-icon" />
      </Link>
    )
  }

  if (isLocked) {
    return (
      <div className="module-card module-card--locked">
        <span className="module-card__num">{module.order}</span>
        <span className="module-card__title">{module.title}</span>
        <FontAwesomeIcon icon={faLock} className="module-card__lock" />
      </div>
    )
  }

  return (
    <Link to={`/dashboard/subject/${subject}/${level}/${module._id}`} className="module-card">
      <span className="module-card__num">{module.order}</span>
      <span className="module-card__title">{module.title}</span>
      {isCompleted
        ? <span className="module-card__check">✓</span>
        : <span className="module-card__arrow">→</span>}
      {isTeacher && <ModuleCardMenu moduleId={module._id} subject={subject} level={level} />}
    </Link>
  )
}

export default ModuleCard
