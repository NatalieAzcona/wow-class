import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProfileCard.scss'

const ProfileCard = () => {
  const { user, logout, updateUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [address, setAddress] = useState(user?.address || '')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSave = async () => {
    const res = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ name: user.name, address })
    })
    if (res.ok) {
      const updated = await res.json()
      updateUser({ ...user, address: updated.address })
      setEditing(false)
    }
  }

  return (
    <div className="profile-card">
      <p className="profile-card__name">{user?.name}</p>
      <p className="profile-card__email">{user?.email}</p>
      <p className="profile-card__role">{user?.role}</p>
      {user?.role === 'student' && !editing && user?.address && (
        <p className="profile-card__address">{user.address}</p>
      )}
      {editing && (
        <div className="profile-card__edit">
          <input
            className="profile-card__input"
            placeholder="Tu dirección"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <div className="profile-card__edit-actions">
            <button className="profile-card__btn" onClick={handleSave}>Guardar</button>
            <button className="profile-card__btn" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <div className="profile-card__actions">
        {user?.role === 'student' && !editing && (
          <button className="profile-card__btn" onClick={() => setEditing(true)}>Editar perfil</button>
        )}
        <button className="profile-card__btn profile-card__btn--logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  )
}

export default ProfileCard
