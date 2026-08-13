import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../../config/api'
import { AuthContext } from '../../context/AuthContext'
import { LEVELS } from '../../data/levels'
import { PLANS } from '../../data/plans'
import './ProfilePage.scss'

const ProfilePage = () => {
  const { user, token, updateUser } = useContext(AuthContext)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [level, setLevel] = useState(user?.level || '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, phone, address, level })
    })
    const updated = await res.json()
    updateUser({ ...user, name: updated.name, phone: updated.phone, address: updated.address, level: updated.level })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="profile-page">
      <Link to="/dashboard/subjects" className="profile-page__back">← Volver a clases</Link>
      <h2 className="profile-page__title">Mi información</h2>
      <p className="profile-page__note">
        El teléfono y la dirección solo son necesarios si quieres asistir a clases presenciales en Granada / Maracena.
      </p>
      <form className="profile-page__form" onSubmit={handleSubmit}>
        <label className="profile-page__label">
          Nombre
          <input
            className="profile-page__input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label className="profile-page__label">
          Correo electrónico
          <input
            className="profile-page__input profile-page__input--readonly"
            value={user?.email || ''}
            readOnly
          />
        </label>
        {user?.role === 'student' && (
          <label className="profile-page__label">
            Nivel
            <select
              className="profile-page__input profile-page__input--readonly"
              value={level}
              onChange={e => setLevel(e.target.value)}
              disabled
            >
              <option value="">Selecciona tu nivel</option>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </label>
        )}
        {user?.role === 'student' && (
          <label className="profile-page__label">
            Plan actual
            <input
              className="profile-page__input profile-page__input--readonly"
              value={PLANS.find(p => p.key === user?.plan)?.name ?? 'Solo clases'}
              readOnly
            />
          </label>
        )}
        <label className="profile-page__label">
          Teléfono
          <input
            className="profile-page__input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+34 600 000 000"
          />
        </label>
        <label className="profile-page__label">
          Dirección
          <input
            className="profile-page__input"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Calle, número, ciudad"
          />
        </label>
        <button type="submit" className="profile-page__save">
          {saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

export default ProfilePage
