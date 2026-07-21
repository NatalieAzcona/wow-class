import React, { useEffect } from 'react'
import { API } from '../../config/api'
import { useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const GoogleCalendarBanner = () => {
  const location = useLocation()
  const queryClient = useQueryClient()

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  const justConnected = new URLSearchParams(location.search).get('google') === 'connected'
  useEffect(() => {
    if (justConnected) queryClient.invalidateQueries(['me'])
  }, [justConnected])

  const handleConnect = () => {
    const token = localStorage.getItem('token')
    window.location.href = API + `/auth/google?token=${token}`
  }

  const handleChange = async () => {
    await fetch(`${API}/auth/google`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    handleConnect()
  }

  if (!me) return null

  if (!me.googleConnected) return (
    <div className="calendar-google-banner">
      <span>Conecta tu Google para activar videollamadas con Meet</span>
      <button onClick={handleConnect}>Conectar Google</button>
    </div>
  )

  return (
    <div className="calendar-google-connected">
      <span>Google conectado · {me.googleEmail}</span>
      <button onClick={handleChange}>Cambiar cuenta</button>
    </div>
  )
}

export default GoogleCalendarBanner
