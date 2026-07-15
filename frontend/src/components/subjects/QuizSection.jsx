import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import QuizQuestionForm from './QuizQuestionForm'
import QuizQuestionCard from './QuizQuestionCard'
import QuizStudent from './QuizStudent'
import { API } from '../../config/api'
import './QuizSection.scss'

const TOKEN = () => localStorage.getItem('token')

const QuizSection = ({ module, isTeacher }) => {
  const queryClient = useQueryClient()
  const [adding, setAdding] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const { data: quiz } = useQuery({
    queryKey: ['quiz', module._id],
    queryFn: () =>
      fetch(`${API}/quiz/module/${module._id}`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      }).then(res => res.json()),
  })

  const saveMutation = useMutation({
    mutationFn: ({ questions }) => {
      if (quiz?._id) {
        return fetch(`${API}/quiz/${quiz._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
          body: JSON.stringify({ module: module._id, questions }),
        }).then(res => res.json())
      }
      return fetch(`${API}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ module: module._id, questions }),
      }).then(res => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz', module._id])
      setAdding(false)
      setEditingQuestion(null)
    },
  })

  const handleSaveQuestion = (questionData) => {
    const current = quiz?.questions ?? []
    if (editingQuestion !== null) {
      const updated = current.map((q, i) => i === editingQuestion ? questionData : q)
      saveMutation.mutate({ questions: updated })
    } else {
      saveMutation.mutate({ questions: [...current, questionData] })
    }
  }

  const handleDelete = (index) => {
    const updated = (quiz?.questions ?? []).filter((_, i) => i !== index)
    saveMutation.mutate({ questions: updated })
  }

  const questions = quiz?.questions ?? []

  if (!isTeacher) {
    if (questions.length === 0) return <p className="quiz-section__empty">No hay preguntas aún.</p>
    return <QuizStudent quiz={quiz} />
  }

  return (
    <div className="quiz-section">
      {questions.length === 0 && !adding && (
        <p className="quiz-section__empty">No hay preguntas aún.</p>
      )}

      {questions.map((q, i) => (
        <QuizQuestionCard
          key={i}
          q={q}
          index={i}
          onEdit={(i) => { setEditingQuestion(i); setAdding(false) }}
          onDelete={handleDelete}
        />
      ))}

      {(adding || editingQuestion !== null) && (
        <QuizQuestionForm
          initial={editingQuestion !== null ? questions[editingQuestion] : null}
          onSave={handleSaveQuestion}
          onCancel={() => { setAdding(false); setEditingQuestion(null) }}
          isPending={saveMutation.isPending}
        />
      )}

      {isTeacher && !adding && editingQuestion === null && (
        <button className="quiz-section__add-btn" onClick={() => setAdding(true)}>
          + Añadir pregunta
        </button>
      )}
    </div>
  )
}

export default QuizSection
