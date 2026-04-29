import { useNavigate } from 'react-router-dom'
import './Prices.scss'

const Prices = () => {
  const navigate = useNavigate()

  return (
    <section className="prices">
      <h2 className="prices__title">Precios</h2>
      <p className="prices__subtitle">Sin suscripciones. Pagas solo por las clases que quieres.</p>
      <div className="prices__cards">
        <div className="prices__card">
          <h3 className="prices__card-title">Una materia</h3>
          <p className="prices__card-info">Inglés o Matemáticas</p>
          <p className="prices__card-price">15€ /clase</p>
          <button className="prices__card-btn" onClick={() => navigate('/register')}>Empezar</button>
        </div>
        <div className="prices__card">
          <h3 className="prices__card-title">Las dos materias</h3>
          <p className="prices__card-info">Inglés + Matemáticas</p>
          <p className="prices__card-price">12€ /clase</p>
          <button className="prices__card-btn" onClick={() => navigate('/register')}>Empezar</button>
        </div>
      </div>
    </section>
  )
}

export default Prices
