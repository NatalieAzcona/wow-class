import useAuth from '../../hooks/useAuth'
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import SubjectCalendar from '../calendar/SubjectCalendar'
import LevelTeacher from './LevelPath'
import LevelStudent from './LevelStudent'
import RevenuePage from '../../pages/dashboards/RevenuePage'
import PlansManager from './PlansManager'
import { API } from '../../config/api'
import './SubjectPage.scss'

const SubjectPage = () => {
  const { subject } = useParams()
  const { user } = useAuth()
  const [tab, setTab] = useState('modules')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['modules'],
    queryFn: () => fetch(`${API}/module`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Ocurrió un error</div>

  return (
    <div className={`subject-page${subject === 'matemáticas' ? ' subject-page--matematicas' : ''}`}>
      <Link to="/dashboard/subjects" className="subject-page__back">← Volver</Link>
      <nav className="subject-page__tabs">
        <button
          className={`subject-page__tab${tab === 'modules' ? ' subject-page__tab--active' : ''}`}
          onClick={() => setTab('modules')}
        >
          Clases
        </button>
        <button
          className={`subject-page__tab${tab === 'agenda' ? ' subject-page__tab--active' : ''}`}
          onClick={() => setTab('agenda')}
        >
          {user.role === 'teacher' ? 'Calendario' : 'Agenda'}
        </button>
        {user.role === 'teacher' && (
          <button
            className={`subject-page__tab${tab === 'revenue' ? ' subject-page__tab--active' : ''}`}
            onClick={() => setTab('revenue')}
          >
            Finanzas
          </button>
        )}
        {user.role === 'teacher' && (
          <button
            className={`subject-page__tab${tab === 'plans' ? ' subject-page__tab--active' : ''}`}
            onClick={() => setTab('plans')}
          >
            Planes
          </button>
        )}
      </nav>

      {tab === 'agenda' && (
        <section className="subject-page__section">
          <div className="subject-page__calendar">
            <SubjectCalendar subject={subject} />
          </div>
          {user.role === 'student' && (
            <p className="subject-page__info">
              Elige si prefieres clase online o presencial. Las clases presenciales solo pueden ser en Granada - Maracena.
            </p>
          )}
        </section>
      )}

      {tab === 'revenue' && (
        <section className="subject-page__section">
          <RevenuePage />
        </section>
      )}

      {tab === 'plans' && (
        <section className="subject-page__section">
          <PlansManager />
        </section>
      )}

      {tab === 'modules' && (
        <section className="subject-page__section">
          <h2>Niveles</h2>
          {Array.isArray(data) && (
            user.role === 'teacher'
              ? <LevelTeacher data={data} subject={subject} />
              : <LevelStudent data={data} subject={subject} userLevel={user.level} />
          )}
        </section>
      )}
    </div>
  )
}

export default SubjectPage
