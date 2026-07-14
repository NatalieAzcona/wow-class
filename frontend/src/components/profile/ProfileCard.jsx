import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './ProfileCard.scss'

const ProfileCard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="profile-card">
      <p className="profile-card__name">{user?.name}</p>
      <p className="profile-card__email">{user?.email}</p>
      <p className="profile-card__role">{user?.role}</p>
      <div className="profile-card__actions">
        {user?.role === 'student' && (
          <Link to="/dashboard/profile" className="profile-card__link">
            Editar información
          </Link>
        )}
        <button className="profile-card__btn profile-card__btn--logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default ProfileCard
