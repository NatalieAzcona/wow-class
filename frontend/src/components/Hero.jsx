import './hero.scss'


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Wöw Class</h1>
        <p className="hero__subtitle">
          ¡Tu momento de apuntar al 10!
        </p>
        <p className="hero__slogan">
          Tú decides el ritmo. Sin suscripciones, sin compromisos.
        </p>
        <a href="/register" className="hero__cta">Empieza ahora</a>
      </div>
    </section>
  )
}

export default Hero
