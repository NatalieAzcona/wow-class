import React, { useState } from 'react'
import './QuizQuestionForm.scss'

const EMPTY = { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }

const QuizQuestionForm = ({ initial, onSave, onCancel, isPending }) => {
  const [question, setQuestion] = useState(initial?.question ?? EMPTY.question)
  const [options, setOptions] = useState(
    initial ? initial.options : EMPTY.options
  )
  const [correctIndex, setCorrectIndex] = useState(
    initial ? initial.options.indexOf(initial.correctAnswer) : 0
  )
  const [explanation, setExplanation] = useState(initial?.explanation ?? EMPTY.explanation)

  const handleOption = (i, val) => {
    const next = [...options]
    next[i] = val
    setOptions(next)
  }

  const handleSubmit = () => {
    if (!question.trim() || options.some(o => !o.trim())) return
    onSave({
      question,
      options,
      correctAnswer: options[correctIndex],
      explanation,
    })
  }

  return (
    <div className="quiz-form">
      <div className="quiz-form__field">
        <label className="quiz-form__label">Pregunta</label>
        <input
          className="quiz-form__input"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Escribe la pregunta..."
        />
      </div>

      <div className="quiz-form__options">
        {options.map((opt, i) => (
          <div key={i} className="quiz-form__option-row">
            <button
              type="button"
              className={`quiz-form__radio${correctIndex === i ? ' quiz-form__radio--selected' : ''}`}
              onClick={() => setCorrectIndex(i)}
            />
            <input
              className="quiz-form__input"
              value={opt}
              onChange={e => handleOption(i, e.target.value)}
              placeholder={`Opción ${i + 1}`}
            />
          </div>
        ))}
        <p className="quiz-form__hint">Selecciona el círculo de la opción correcta</p>
      </div>

      <div className="quiz-form__field">
        <label className="quiz-form__label">Explicación</label>
        <textarea
          className="quiz-form__textarea"
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          placeholder="¿Por qué es correcta esa respuesta?"
          rows={3}
        />
      </div>

      <div className="quiz-form__actions">
        <button className="quiz-form__save" onClick={handleSubmit} disabled={isPending}>
          {isPending ? '...' : 'Guardar'}
        </button>
        <button className="quiz-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}

export default QuizQuestionForm
