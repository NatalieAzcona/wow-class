import './hero.scss'


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__text">
        <h1 className="hero__title">W<span className="brand-o">ö</span>W Class</h1>
        <p className="hero__subtitle">¡Tu momento de apuntar al 10!</p>
      </div>
      <img src="/clase-1.png" alt="Clase online" className="hero__image" />
      <a href="/register" className="hero__cta">Empieza ahora</a>
    </section>
  )
}

export default Hero
