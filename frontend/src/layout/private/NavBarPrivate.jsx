import React from 'react'
import { NavLink } from "react-router-dom"
import "./NavBarPrivate.scss"
import AvatarMenu from '../../components/profile/AvatarMenu'

const NavBarPrivate = () => {

    return (
        <nav className="navbar">
          <NavLink to="/" className="navbar__logo">W<span className="brand-o">ö</span>W</NavLink>
          <div className="navbar__links">
            <AvatarMenu/>
          </div>
        </nav>
      )
    }

export default NavBarPrivate
