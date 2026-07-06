import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import SubjectCard from '../../components/subjects/SubjectCard'
import './ModulesPage.scss'

const ModulesPage = () => {
  const { user } = useContext(AuthContext)

  const allCards = [
    { subject: 'english', path: '/dashboard/subject/inglés', key: 'inglés' },
    { subject: 'math', path: '/dashboard/subject/matemáticas', key: 'matemáticas' },
  ]

  const cards = user.role === 'teacher'
    ? allCards.filter(c => c.key === user.subject)
    : allCards

  return (
    <div className="modules-page">
      <h2>Módulos</h2>
      <div className="modules-page__cards">
        {cards.map(c => (
          <SubjectCard key={c.key} subject={c.subject} path={c.path} />
        ))}
      </div>
    </div>
  )
}

export default ModulesPage
