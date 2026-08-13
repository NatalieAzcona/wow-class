import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../config/api'
import { PLANS } from '../../data/plans'
import { LEVELS } from '../../data/levels'
import './PlansManager.scss'

const TOKEN = () => localStorage.getItem('token')

const PlansManager = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [pending, setPending] = useState({})

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetch(`${API}/users/students`, {
      headers: { Authorization: `Bearer ${TOKEN()}` }
    }).then(res => res.json())
  })

  const planMutation = useMutation({
    mutationFn: ({ id, plan }) =>
      fetch(`${API}/users/${id}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ plan })
      }).then(res => res.json())
  })

  const levelMutation = useMutation({
    mutationFn: ({ id, level }) =>
      fetch(`${API}/users/${id}/level`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ level })
      }).then(res => res.json())
  })

  const handleChange = (id, field, value) => {
    setPending(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  const handleSave = async (student) => {
    const changes = pending[student._id]
    if (!changes) return
    const promises = []
    if (changes.plan !== undefined) promises.push(planMutation.mutateAsync({ id: student._id, plan: changes.plan }))
    if (changes.level !== undefined) promises.push(levelMutation.mutateAsync({ id: student._id, level: changes.level }))
    await Promise.all(promises)
    queryClient.invalidateQueries(['students'])
    setPending(prev => { const next = { ...prev }; delete next[student._id]; return next })
  }

  if (isLoading) return <p className="plans-manager__empty">Cargando...</p>

  const list = Array.isArray(students) ? students : []
  const filtered = search.trim()
    ? list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : list

  return (
    <div className="plans-manager">
      <input
        className="plans-manager__search"
        type="text"
        placeholder="Buscar alumno..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 && (
        <p className="plans-manager__empty">
          {search ? 'Sin resultados.' : 'No hay estudiantes registrados.'}
        </p>
      )}

      {filtered.map(student => {
        const changes = pending[student._id]
        const currentPlan = changes?.plan ?? student.plan ?? 'clases'
        const currentLevel = changes?.level ?? student.level ?? ''
        const hasChanges = !!changes

        return (
          <div key={student._id} className="plans-manager__row">
            <div className="plans-manager__info">
              <span className="plans-manager__name">{student.name}</span>
              <span className="plans-manager__email">{student.email}</span>
            </div>
            <div className="plans-manager__selects">
              <select
                className="plans-manager__select"
                value={currentLevel}
                onChange={e => handleChange(student._id, 'level', e.target.value)}
              >
                <option value="">Sin nivel</option>
                {LEVELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select
                className="plans-manager__select"
                value={currentPlan}
                onChange={e => handleChange(student._id, 'plan', e.target.value)}
              >
                {PLANS.map(p => (
                  <option key={p.key} value={p.key}>{p.name}</option>
                ))}
              </select>
              {hasChanges && (
                <button
                  className="plans-manager__save"
                  onClick={() => handleSave(student)}
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlansManager
