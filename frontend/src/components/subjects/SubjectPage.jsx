import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import SubjectCalendar from '../calendar/SubjectCalendar'
import LevelPath from './LevelPath'
import { API } from '../../config/api'
import './SubjectPage.scss'

const SubjectPage = () => {
  const { subject } = useParams()
  const { user } = useContext(AuthContext)
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
    <div className="subject-page">
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

      {tab === 'modules' && (
        <section className="subject-page__section">
          <h2>Módulos</h2>
          {Array.isArray(data) && <LevelPath data={data} subject={subject} />}
        </section>
      )}
    </div>
  )
}

export default SubjectPage
