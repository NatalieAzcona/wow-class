import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '../../data/plans'
import { WHATSAPP } from '../../config/api'
import './PlansPage.scss'

const wa = (plan) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, me interesa contratar el plan ${plan} de WöW Class.`)}`

const PlansPage = () => {
  const navigate = useNavigate()
  return (
  <div className="plans-page">
    <button className="plans-page__back" onClick={() => navigate(-1)}>← Volver</button>
    <h2 className="plans-page__title">Elige tu plan</h2>
    <div className="plans-page__grid">
      {PLANS.map(plan => (
        <div key={plan.key} className={`plan-card${plan.highlighted ? ' plan-card--highlighted' : ''}`}>
          {plan.badge && <span className="plan-card__badge">{plan.badge}</span>}
          <h3 className="plan-card__name">{plan.name}</h3>
          <div className="plan-card__price">
            {plan.originalPrice && (
              <span className="plan-card__original">{plan.originalPrice}</span>
            )}
            <span className="plan-card__amount">{plan.price}</span>
            <span className="plan-card__period">{plan.period}</span>
          </div>
          <ul className="plan-card__features">
            {plan.features.map((f, i) => (
              <li key={i} className="plan-card__feature">
                <span className="plan-card__check">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            className="plan-card__cta"
            href={wa(plan.name)}
            target="_blank"
            rel="noreferrer"
          >
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
    <p className="plans-page__subtitle">Nunca te pediremos suscripciones: al elegir un plan, pagas por el mes que deseas estudiar. El profesor activa tu plan apenas se valide tu pago por Bizum o transferencia.</p>
  </div>
  )
}

export default PlansPage
