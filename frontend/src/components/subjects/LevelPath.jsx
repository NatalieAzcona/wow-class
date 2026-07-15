import React from 'react'
import { Link } from 'react-router-dom'
import './LevelPath.scss'

const niveles = ["1º de Primaria", "2º de Primaria", "3º de Primaria", "4º de Primaria", "5º de Primaria", "6º de Primaria", "1º de ESO", "2º de ESO", "3º de ESO", "4º de ESO", "1º de Bachillerato", "2º de Bachillerato"]

const LevelPath = ({ data, subject }) => {
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
}

export default LevelPath
