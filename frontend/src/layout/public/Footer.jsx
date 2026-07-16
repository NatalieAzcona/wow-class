import { Link } from 'react-router-dom'
import './Footer.scss'


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__logo">W<span className="brand-o">ö</span>W</span>
        <p className="footer__tagline">Clases de inglés y matemáticas para niños</p>
      </div>

      <div className="footer__links">
        <ul>
          <li><Link to="/aviso-legal" className="footer__link">Aviso legal</Link></li>
          <li><Link to="/privacidad" className="footer__link">Política de privacidad</Link></li>
          <li><Link to="/cookies" className="footer__link">Cookies</Link></li>
        </ul>
      </div>

      <p className="footer__copy">© 2026 WöW Class. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer
