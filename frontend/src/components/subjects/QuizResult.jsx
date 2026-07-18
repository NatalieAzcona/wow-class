import React from 'react'

const QuizResult = ({ score, total, onRestart }) => (
  <div className="quiz-student__result">
    <p className="quiz-student__score-msg">{score} / {total}</p>
    <button className="quiz-student__restart" onClick={onRestart}>
      Reintentar
    </button>
  </div>
)

export default QuizResult
