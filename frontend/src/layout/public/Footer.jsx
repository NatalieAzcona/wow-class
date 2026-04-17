import './Footer.scss'


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__logo">WöW</span>
        <p className="footer__tagline">Clases de inglés y matemáticas para niños</p>
      </div>

      <div className="footer__links">
        <ul>
          <li className="footer__link">Aviso legal</li>
          <li className="footer__link">Política de privacidad</li>
          <li className="footer__link">Cookies</li>
        </ul>
      </div>

      <p className="footer__copy">© 2026 Wöw Class. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer
