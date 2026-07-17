import React from 'react'
import './ModuleActions.scss'

const ModuleActions = ({ onSave, onCancel, isPending }) => {
  return (
    <div className="module-actions">
      <button className="module-actions__save" onClick={onSave} disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
      <button className="module-actions__cancel" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  )
}

export default ModuleActions
