import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import './ProfileCard.scss'

const ProfileCard = () => {

  const { user } = useContext(AuthContext)
  const initial = user.name?.charAt(0).toUpperCase()

  return (
    <div className="profile-card">
      <div className="profile-card__avatar">{initial}</div>
      <p className="profile-card__name">{user.name}</p>
      <p className="profile-card__email">{user.email}</p>
      <p className="profile-card__role">{user.role}</p>
      <div className="profile-card__actions">
        <button className="profile-card__btn">Editar perfil</button>
      </div>
    </div>
  )
}

export default ProfileCard
