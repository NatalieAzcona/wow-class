import React, { useContext } from 'react'
import { NavLink } from "react-router-dom"
import "./NavBarPrivate.scss"
import { AuthContext } from '../../context/AuthContext'

const NavBarPrivate = () => {

const { user } = useContext(AuthContext)
const initial = user.name?.charAt(0).toUpperCase()


    return (
        <nav className="navbar">
          <NavLink to="/" className="navbar__logo">WöW</NavLink>
          <div className="navbar__links">
            <button className='navbar__avatar'>{user.avatar ? <img src={user.avatar} /> : initial} </button>
          </div>
        </nav>
      )
    }

export default NavBarPrivate
