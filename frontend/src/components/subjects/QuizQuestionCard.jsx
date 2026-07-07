import React from 'react'

const QuizQuestionCard = ({ q, index, onEdit, onDelete }) => (
  <div className="quiz-section__card">
    <div className="quiz-section__card-header">
      <span className="quiz-section__card-num">{index + 1}</span>
      <p className="quiz-section__card-question">{q.question}</p>
      <div className="quiz-section__card-actions">
        <button onClick={() => onEdit(index)}>Editar</button>
        <button onClick={() => onDelete(index)}>Eliminar</button>
      </div>
    </div>
    <ul className="quiz-section__options">
      {q.options.map((opt, j) => (
        <li
          key={j}
          className={`quiz-section__option${opt === q.correctAnswer ? ' quiz-section__option--correct' : ''}`}
        >
          {opt}
        </li>
      ))}
    </ul>
    {q.explanation && (
      <p className="quiz-section__explanation">{q.explanation}</p>
    )}
  </div>
)

export default QuizQuestionCard
