import React, { useContext, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import ModuleCard from './ModuleCard'
import AddModuleForm from './AddModuleForm'
import { API } from '../../config/api'
import './LevelPage.scss'

const LevelPage = () => {
    const { subject, level } = useParams()
    const { user } = useContext(AuthContext)
    const isTeacher = user?.role === 'teacher'
    const [adding, setAdding] = useState(false)

    if (user?.role === 'student' && level !== user?.level) {
        return <Navigate to={`/dashboard/subject/${subject}`} replace />
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules', subject, level],
        queryFn: () => fetch(`${API}/module`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json())
    })

    const { data: completedIds = [] } = useQuery({
        queryKey: ['progress'],
        queryFn: () => fetch(`${API}/progress`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json()),
        enabled: !isTeacher
    })

    if (isLoading) return <div>Cargando...</div>
    if (isError) return <div>Ocurrió un error</div>

    const modulos = Array.isArray(data)
        ? data.filter(m => m.subject === subject && m.level === level)
        : []

    return (
        <div className={`level-page${subject === 'matemáticas' ? ' level-page--matematicas' : ''}`}>
            <Link to={`/dashboard/subject/${subject}`} className="level-page__back">
                ← {subject}
            </Link>
            <h2 className="level-page__title">{level}</h2>
            <div className="level-page__list">
                {modulos.length === 0 && (
                    <p className="level-page__empty">No hay módulos disponibles para este nivel.</p>
                )}
                {modulos.map((module, i) => {
                    const isPlanLocked = !isTeacher && user?.plan === 'clases' && i > 0
                    const isLocked = !isTeacher && !isPlanLocked && i > 0 && !completedIds.includes(modulos[i - 1]._id)
                    const isCompleted = !isTeacher && completedIds.includes(module._id)
                    return (
                        <ModuleCard
                            key={module._id}
                            module={module}
                            subject={subject}
                            level={level}
                            isTeacher={isTeacher}
                            isLocked={isLocked}
                            isCompleted={isCompleted}
                            isPlanLocked={isPlanLocked}
                        />
                    )
                })}
                {isTeacher && adding && (
                    <AddModuleForm
                        nextOrder={modulos.length + 1}
                        subject={subject}
                        level={level}
                        onCancel={() => setAdding(false)}
                    />
                )}
            </div>
            {isTeacher && !adding && (
                <button className="level-page__add-btn" onClick={() => setAdding(true)}>
                    + Añadir unidad
                </button>
            )}
        </div>
    )
}

export default LevelPage
