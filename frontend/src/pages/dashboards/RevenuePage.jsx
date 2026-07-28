import React, { useState, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import { API } from '../../config/api'
import './RevenuePage.scss'

const DISCOUNT_OPTIONS = [
  { label: 'Sin descuento', price: 15 },
  { label: 'Dos materias', price: 12 },
]

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

const RevenuePage = () => {
  const { token } = useContext(AuthContext)
  const [discounts, setDiscounts] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long' })
  const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + currentMonth.getFullYear()

  const { data, isLoading } = useQuery({
    queryKey: ['reservationsTeacher'],
    queryFn: () => fetch(`${API}/reservation`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
  })

  if (isLoading) return <div>Cargando...</div>

  const confirmed = Array.isArray(data) ? data.filter(r => {
    if (r.status !== 'confirmada') return false
    const d = new Date(r.availability?.startTime)
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()
  }) : []

  const getPrice = (id) => {
    const option = DISCOUNT_OPTIONS.find(o => o.label === discounts[id])
    return option ? option.price : 15
  }

  const total = confirmed.reduce((sum, r) => sum + getPrice(r._id), 0)
  const subject = confirmed[0]?.availability?.subject || ''

  return (
    <div className="revenue-page">
      <h2>Finanzas</h2>

      <div className="revenue-page__nav">
        <button className="revenue-page__nav-btn" onClick={prevMonth}>←</button>
        <span className="revenue-page__nav-label">{monthLabel}</span>
        <button className="revenue-page__nav-btn" onClick={nextMonth}>→</button>
      </div>

      <section className="revenue-page__section">
        <h3 className="revenue-page__subtitle">Clases confirmadas de {subject}</h3>
        {confirmed.length === 0 ? (
          <p className="revenue-page__empty">No hay clases confirmadas.</p>
        ) : (
          <table className="revenue-page__table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Fecha</th>
                <th>Formato</th>
                <th>Descuento</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {confirmed.map(r => (
                <tr key={r._id}>
                  <td>{r.student?.name || '—'}</td>
                  <td>{r.availability?.startTime ? formatDate(r.availability.startTime) : '—'}</td>
                  <td>{r.mode === 'online' ? 'Online' : 'Presencial'}</td>
                  <td>
                    <select
                      className="revenue-page__select"
                      value={discounts[r._id] || 'Sin descuento'}
                      onChange={e => setDiscounts(prev => ({ ...prev, [r._id]: e.target.value }))}
                    >
                      {DISCOUNT_OPTIONS.map(o => (
                        <option key={o.label}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="revenue-page__price">{getPrice(r._id)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="revenue-page__total">Total confirmado: <strong>{total}€</strong></p>
      </section>

    </div>
  )
}

export default RevenuePage
