import { NavLink } from "react-router-dom"
import "./NavBarPublic.scss"

const NavBarPublic = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">W<span className="brand-o">ö</span>W</NavLink>
      <div className="navbar__links">
        <NavLink to="/register" className="navbar__link">Register</NavLink>
        <NavLink to="/login" className="navbar__link">Login</NavLink>
      </div>
    </nav>
  )
}

export default NavBarPublic