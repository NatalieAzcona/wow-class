import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import CalendarProfessor from '../../components/calendar/CalendarProfessor'
import './ProfessorDashboard.scss'

const ProfessorDashboard = () => {
  const location = useLocation()
  const justConnected = new URLSearchParams(location.search).get('google') === 'connected'

  const { data: me, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('http://localhost:3000/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json())
  })

  useEffect(() => {
    if (justConnected) refetch()
  }, [justConnected])

  const handleConnectGoogle = () => {
    const token = localStorage.getItem('token')
    window.location.href = `http://localhost:3000/api/v1/auth/google?token=${token}`
  }

  const handleChangeGoogle = async () => {
    await fetch('http://localhost:3000/api/v1/auth/google', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    handleConnectGoogle()
  }

  return (
    <div className="professor-dashboard">
      <h2 className="professor-dashboard__title">Calendario</h2>
      {me && !me.googleConnected && (
        <div className="professor-dashboard__google-banner">
          <span>Conecta tu Google para activar videollamadas con Meet</span>
          <button className="professor-dashboard__google-btn" onClick={handleConnectGoogle}>
            Conectar Google
          </button>
        </div>
      )}
      {me && me.googleConnected && (
        <div className="professor-dashboard__google-connected">
          <span>Google conectado</span>
          <button className="professor-dashboard__google-change" onClick={handleChangeGoogle}>
            Cambiar cuenta
          </button>
        </div>
      )}
      <div className="professor-dashboard__calendar">
        <CalendarProfessor />
      </div>
    </div>
  )
}

export default ProfessorDashboard
