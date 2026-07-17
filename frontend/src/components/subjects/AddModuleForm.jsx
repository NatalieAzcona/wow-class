import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../config/api'
import './AddModuleForm.scss'

const AddModuleForm = ({ nextOrder, subject, level, onCancel }) => {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')

    const createMutation = useMutation({
        mutationFn: () =>
            fetch(`${API}/module`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: title.trim(), subject, level, order: nextOrder }),
            }).then(res => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries(['modules', subject, level])
            onCancel()
        },
    })

    return (
        <div className="add-module-form">
            <span className="add-module-form__num">{nextOrder}</span>
            <input
                className="add-module-form__input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nombre de la unidad..."
                autoFocus
                onKeyDown={e => {
                    if (e.key === 'Enter' && title.trim()) createMutation.mutate()
                    if (e.key === 'Escape') onCancel()
                }}
            />
            <button
                className="add-module-form__save"
                onClick={() => createMutation.mutate()}
                disabled={!title.trim() || createMutation.isPending}
            >
                {createMutation.isPending ? '...' : 'Guardar'}
            </button>
            <button className="add-module-form__cancel" onClick={onCancel}>✕</button>
        </div>
    )
}

export default AddModuleForm
