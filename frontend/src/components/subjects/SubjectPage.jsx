import React, { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import CalendarStudent from '../calendar/CalendarStudent'
import './LevelPath.scss'
import './SubjectPage.scss'

const niveles = ["1º de Primaria", "2º de Primaria", "3º de Primaria", "4º de Primaria", "5º de Primaria", "6º de Primaria", "1º de ESO", "2º de ESO", "3º de ESO", "4º de ESO", "1º de Bachillerato", "2º de Bachillerato"]

const SubjectPage = () => {
  const { subject } = useParams()
  const { user } = useContext(AuthContext)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['modules'],
    queryFn: () => fetch('http://localhost:3000/api/v1/module', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Ocurrió un error</div>

  return (
    <div className="subject-page">
      {user.role === 'student' && (
        <section className="subject-page__section">
          <h2>Agenda tu clase de {subject}</h2>
          <CalendarStudent subject={subject} />
          <p className="subject-page__info">
            Las clases pueden ser online o presenciales si estás en Granada / Maracena, tienen una hora de duración y se deben solicitar con al menos 48 horas de anticipación. Escríbenos al WhatsApp si tienes dudas :)
          </p>
        </section>
      )}

      <section className="subject-page__section">
        <h2>Módulos</h2>
        {Array.isArray(data) && (() => {
          const visibles = niveles.filter(nivel =>
            data.some(m => m.subject === subject && m.level === nivel)
          )
          return (
            <div className="level-path">
              {visibles.map((nivel, idx) => {
                const count = data.filter(m => m.subject === subject && m.level === nivel).length
                const side = idx % 2 === 0 ? 'left' : 'right'
                return (
                  <div key={nivel} className={`level-path__step level-path__step--${side}`}>
                    <Link to={`/dashboard/subject/${subject}/${nivel}`} className="level-path__tile">
                      <div className="level-path__tile__circle">{idx + 1}</div>
                      <div className="level-path__tile__info">
                        <span className="level-path__tile__name">{nivel}</span>
                        <span className="level-path__tile__count">{count} módulos</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </section>
    </div>
  )
}

export default SubjectPage
