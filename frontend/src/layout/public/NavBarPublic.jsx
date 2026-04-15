import { NavLink } from "react-router-dom";

const NavBarPublic = () => {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/register">Register</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
      

  )
}

export default NavBarPublic
