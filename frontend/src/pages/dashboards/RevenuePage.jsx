import React, { useState, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import { API } from '../../config/api'
import { PLANS } from '../../data/plans'
import './RevenuePage.scss'

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

const getPlan = (key) => PLANS.find(p => p.key === key) ?? PLANS[0]

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

  const getDiscount = (id) => parseFloat(discounts[id]) || 0

  const getPrice = (r) => {
    const base = getPlan(r.student?.plan).classPrice
    return Math.max(0, base - getDiscount(r._id))
  }

  const total = confirmed.reduce((sum, r) => sum + getPrice(r), 0)
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
                <th>Plan</th>
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
                  <td>{getPlan(r.student?.plan).name}</td>
                  <td>
                    <div className="revenue-page__discount-wrap">
                      <input
                        className="revenue-page__discount-input"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={discounts[r._id] ?? ''}
                        onChange={e => setDiscounts(prev => ({ ...prev, [r._id]: e.target.value }))}
                      />
                      <span className="revenue-page__discount-symbol">€</span>
                    </div>
                  </td>
                  <td className="revenue-page__price">{getPrice(r)}€</td>
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
