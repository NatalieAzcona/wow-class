import React, { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../config/api'

const ModuleCardMenu = ({ moduleId, subject, level }) => {
  const queryClient = useQueryClient()
  const [openMenu, setOpenMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!openMenu) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenu])

  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(API + `/module/${moduleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then(res => res.json()),
    onSuccess: () => queryClient.invalidateQueries(['modules', subject, level]),
  })

  if (confirmDelete) return (
    <div className="module-card__confirm">
      <span className="module-card__confirm-text">¿Estás seguro de querer eliminar este módulo?</span>
      <button className="module-card__confirm-yes" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
        {deleteMutation.isPending ? '...' : 'Eliminar'}
      </button>
      <button className="module-card__confirm-no" onClick={() => setConfirmDelete(false)}>Cancelar</button>
    </div>
  )

  return (
    <div className="module-card__menu-wrap" ref={menuRef}>
      <button
        className="module-card__menu-btn"
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpenMenu(prev => !prev) }}
      >···</button>
      {openMenu && (
        <div className="module-card__dropdown">
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(true); setOpenMenu(false) }}>
            Eliminar módulo
          </button>
        </div>
      )}
    </div>
  )
}

export default ModuleCardMenu
