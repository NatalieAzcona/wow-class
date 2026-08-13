import { useNavigate } from 'react-router-dom'
import { STEPS } from '../data/steps'
import './Prices.scss'

const Prices = () => {
  const navigate = useNavigate()

  return (
    <section className="prices">
      <h2 className="prices__title">¿Cómo funciona?</h2>
      <p className="prices__subtitle">Tres pasos para empezar.</p>
      <div className="prices__cards">
        {STEPS.map(step => (
          <div key={step.num} className="prices__card">
            <span className="prices__card-num">{step.num}</span>
            <h3 className="prices__card-title">{step.title}</h3>
            <p className="prices__card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
      <button className="prices__cta" onClick={() => navigate('/register')}>
        Crear cuenta
      </button>
    </section>
  )
}

export default Prices
