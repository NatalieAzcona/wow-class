import React from 'react'
import { Link } from 'react-router-dom'
import ModuleCardMenu from './ModuleCardMenu'
import './ModuleCard.scss'

const ModuleCard = ({ module, subject, level, isTeacher }) => {
  return (
    <Link to={`/dashboard/subject/${subject}/${level}/${module._id}`} className="module-card">
      <span className="module-card__num">{module.order}</span>
      <span className="module-card__title">{module.title}</span>
      <span className="module-card__arrow">→</span>
      {isTeacher && <ModuleCardMenu moduleId={module._id} subject={subject} level={level} />}
    </Link>
  )
}

export default ModuleCard
