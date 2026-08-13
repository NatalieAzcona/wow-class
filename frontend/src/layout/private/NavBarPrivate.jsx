import React, { useContext } from 'react'
import { NavLink } from "react-router-dom"
import "./NavBarPrivate.scss"
import AvatarMenu from '../../components/profile/AvatarMenu'
import NotificationBell from '../../components/notifications/NotificationBell'
import { AuthContext } from '../../context/AuthContext'

const NavBarPrivate = () => {
  const { user } = useContext(AuthContext)

    return (
        <nav className="navbar">
          <NavLink to="/" className="navbar__logo">W<span className="brand-o">ö</span>W</NavLink>
          <div className="navbar__links">
            {user?.role === 'student' && (
              <NavLink to="/dashboard/plans" className="navbar__plans">Planes y precios</NavLink>
            )}
            {user?.role === 'student' && <NotificationBell />}
            <AvatarMenu/>
          </div>
        </nav>
      )
    }

export default NavBarPrivate
