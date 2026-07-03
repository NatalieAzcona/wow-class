import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Dashboard.scss'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  if (!user) return null

  return (
    <div className="dashboard">
      <nav className="dashboard__tabs">
        {user.role === 'teacher' && (
          <NavLink to="/dashboard/calendar" className={({ isActive }) => `dashboard__tab${isActive ? ' dashboard__tab--active' : ''}`}>
            Calendario
          </NavLink>
        )}
        <NavLink to="/dashboard/modules" className={({ isActive }) => `dashboard__tab${isActive ? ' dashboard__tab--active' : ''}`}>
          Módulos
        </NavLink>
      </nav>
      <div className="dashboard__content">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
