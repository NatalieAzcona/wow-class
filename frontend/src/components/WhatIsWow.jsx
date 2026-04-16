const WhatIsWow = () => {
  return (
    <section className="what-is-wow">
      <h2 className="what-is-wow__title">¿Qué es Wöw Class?</h2>
      <p className="what-is-wow__text">
        Wöw Class es más que una plataforma de clases online y presenciales para niños en Granada y Maracena.
        Aprenderás inglés y matemáticas con profesores de amplia experiencia, a tu ritmo y con material + juegos y quizzes por lección.
      </p>

      <div className="what-is-wow__teacher what-is-wow__teacher--left">
        <div className="what-is-wow__teacher-photo"></div>
        <div className="what-is-wow__teacher-bio">
          <h3 className="what-is-wow__teacher-name">Teacher Mary Carmen</h3>
          <p className="what-is-wow__teacher-text">
            Profesora de inglés con más de 30 años de experiencia.
            Sus clases combinan conversación, gramática y pronunciación
            de forma divertida y personalizada para cada alumno.
          </p>
        </div>
      </div>

      <div className="what-is-wow__teacher what-is-wow__teacher--right">
        <div className="what-is-wow__teacher-bio">
          <h3 className="what-is-wow__teacher-name">Profe Enrique</h3>
          <p className="what-is-wow__teacher-text">
            Profesor de matemáticas con más de 30 años de experiencia.
            Explica desde lo más básico hasta lo más complejo con paciencia
            y metodología adaptada a cada nivel.
          </p>
        </div>
        <div className="what-is-wow__teacher-photo"></div>
      </div>
    </section>
  )
}

export default WhatIsWow
