import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { LEVELS } from '../../data/levels'
import './LevelStudent.scss'

const LevelStudent = ({ data, subject, userLevel }) => {
  const levels = LEVELS

  const visibleLevels = levels.filter(level =>
    data.some(m => m.subject === subject && m.level === level)
  )

  const initialIndex = userLevel ? Math.max(0, visibleLevels.indexOf(userLevel)) : 0
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  const prev = () => setActiveIndex(i => Math.max(0, i - 1))
  const next = () => setActiveIndex(i => Math.min(visibleLevels.length - 1, i + 1))

  const cards = [
    { nivel: visibleLevels[activeIndex - 2], position: 'far-prev', idx: activeIndex - 2 },
    { nivel: visibleLevels[activeIndex - 1], position: 'prev', idx: activeIndex - 1 },
    { nivel: visibleLevels[activeIndex], position: 'active', idx: activeIndex },
    { nivel: visibleLevels[activeIndex + 1], position: 'next', idx: activeIndex + 1 },
    { nivel: visibleLevels[activeIndex + 2], position: 'far-next', idx: activeIndex + 2 },
  ].filter(card => card.nivel)

  return (
    <div className="level-carousel">
      <div className="level-carousel__track">
        {cards.map(({ nivel, position, idx }) => {
          const count = data.filter(m => m.subject === subject && m.level === nivel).length
          const isCentered = position === 'active'
          const isUnlocked = nivel === userLevel

          return (
            <div
              key={nivel}
              className={`level-carousel__item level-carousel__item--${position}`}
              onClick={() => !isCentered && setActiveIndex(idx)}
            >
              <Link
                to={`/dashboard/subject/${subject}/${nivel}`}
                className={`level-carousel__tile${isCentered ? ' level-carousel__tile--active' : ''}${!isUnlocked ? ' level-carousel__tile--locked' : ''}`}
                onClick={e => !isUnlocked && e.preventDefault()}
              >
                {isUnlocked ? (
                  <>
                    <div className="level-carousel__circle">{idx + 1}</div>
                    <div className="level-carousel__info">
                      <span className="level-carousel__name">{nivel}</span>
                      <span className="level-carousel__count">{count} módulos</span>
                    </div>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} className="level-carousel__lock" />
                    <div className="level-carousel__info">
                      <span className="level-carousel__name">{nivel}</span>
                      <span className="level-carousel__hint">Contáctanos para desbloquear</span>
                    </div>
                  </>
                )}
              </Link>
            </div>
          )
        })}
      </div>

      <div className="level-carousel__nav">
        <button className="level-carousel__btn" onClick={prev}>←</button>
        <span className="level-carousel__label">{visibleLevels[activeIndex]}</span>
        <button className="level-carousel__btn" onClick={next}>→</button>
      </div>
    </div>
  )
}

export default LevelStudent
