import { NavLink } from "react-router-dom"
import "./NavBarPublic.scss"

const NavBarPublic = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">Wöw Class</NavLink>
      <div className="navbar__links">
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  )
}

export default NavBarPublic
