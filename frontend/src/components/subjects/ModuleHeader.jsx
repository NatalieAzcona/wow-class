import React, { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../config/api'
import './ModuleHeader.scss'

const ModuleHeader = ({ module, isTeacher }) => {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(module.title)
  const inputRef = useRef(null)

  const saveMutation = useMutation({
    mutationFn: (title) =>
      fetch(API + `/module/${module._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          subject: module.subject,
          level: module.level,
          content: module.content,
          videoUrl: module.videoUrl,
        }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['module', module._id])
      setEditing(false)
    },
  })

  const startEdit = () => {
    setValue(module.title)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const save = () => {
    if (value.trim() && value !== module.title) {
      saveMutation.mutate(value.trim())
    } else {
      setEditing(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setValue(module.title); setEditing(false) }
  }

  return (
    <div className="module-header">
      {editing ? (
        <>
          <input
            ref={inputRef}
            className="module-header__input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="module-header__actions">
            <button className="module-header__save" onClick={save} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? '...' : 'Guardar'}
            </button>
            <button className="module-header__cancel" onClick={() => { setValue(module.title); setEditing(false) }}>✕</button>
          </div>
        </>
      ) : (
        <div className="module-header__title-wrap">
          <h2 className="module-header__title">{module.title}</h2>
          {isTeacher && (
            <button className="module-header__edit-btn" onClick={startEdit}>Editar</button>
          )}
        </div>
      )}
    </div>
  )
}

export default ModuleHeader
