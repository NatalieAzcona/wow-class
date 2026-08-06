import React, { useContext, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faBookOpen, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../context/AuthContext'
import ModuleHeader from './ModuleHeader'
import VideoSection from './VideoSection'
import ContentSection from './ContentSection'
import QuizSection from './QuizSection'
import { API } from '../../config/api'
import './ModulePage.scss'

const SECTIONS = [
  { id: 'video',   label: 'Video',     icon: faPlay },
  { id: 'content', label: 'Contenido', icon: faBookOpen },
  { id: 'quiz',    label: 'Quiz',      icon: faQuestion },
]

const ModulePage = () => {
  const { subject, level, moduleId } = useParams()
  const { user } = useContext(AuthContext)
  const isTeacher = user?.role === 'teacher'
  const [activeSection, setActiveSection] = useState('video')
  const queryClient = useQueryClient()
  const levelPath = `/dashboard/subject/${subject}/${level}`

  const { data: completedIds = [] } = useQuery({
    queryKey: ['progress'],
    queryFn: () => fetch(`${API}/progress`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()),
    enabled: !isTeacher
  })

  const isCompleted = completedIds.includes(moduleId)

  const handlePass = async () => {
    await fetch(`${API}/progress/${moduleId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    queryClient.invalidateQueries(['progress'])
  }

  if (user?.role === 'student' && level !== user?.level) {
    return <Navigate to={`/dashboard/subject/${subject}`} replace />
  }

  const { data: module, isLoading, isError } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () =>
      fetch(API + `/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
  })

  if (isLoading) return <div className="module-page"><p>Cargando...</p></div>
  if (isError || !module) return <div className="module-page"><p>Error al cargar el módulo.</p></div>

  if (user?.role === 'student' && user?.plan === 'clases' && module.order > 1) {
    return <Navigate to="/dashboard/plans" replace />
  }

  return (
    <div className={`module-page${subject === 'matemáticas' ? ' module-page--matematicas' : ''}`}>
      <Link to={`/dashboard/subject/${subject}/${level}`} className="module-page__back">
        ← {level}
      </Link>

      <ModuleHeader module={module} isTeacher={isTeacher} />

      <div className="module-page__tabs">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            className={`module-page__tab${activeSection === s.id ? ' module-page__tab--active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="module-page__tab-icon">
              <FontAwesomeIcon icon={s.icon} />
            </span>
            <span className="module-page__tab-label">{s.label}</span>

          </button>
        ))}
      </div>

      {activeSection === 'video'   && <VideoSection   module={module} isTeacher={isTeacher} />}
      {activeSection === 'content' && <ContentSection module={module} isTeacher={isTeacher} />}
      {activeSection === 'quiz'    && <QuizSection    module={module} isTeacher={isTeacher} onPass={handlePass} levelPath={levelPath} isCompleted={isCompleted} />}
    </div>
  )
}

export default ModulePage
