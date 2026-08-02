import React from 'react'

const QuizResult = ({ answers, questions, onRestart }) => {
  const score = answers.filter(a => a.isCorrect).length
  const total = questions.length
  const passed = score === total

  return (
    <div className="quiz-student__result">
      <p className={`quiz-student__score-msg${passed ? ' quiz-student__score-msg--passed' : ''}`}>
        {passed ? '¡Aprobado!' : `${score} de ${total} correctas`}
      </p>

      <div className="quiz-student__breakdown">
        {questions.map((q, i) => (
          <div
            key={i}
            className={`quiz-student__answer-row${answers[i]?.isCorrect ? ' quiz-student__answer-row--correct' : ' quiz-student__answer-row--wrong'}`}
          >
            <span className="quiz-student__answer-icon">{answers[i]?.isCorrect ? '✓' : '✗'}</span>
            <span className="quiz-student__answer-text">{q.question}</span>
          </div>
        ))}
      </div>

      {!passed && (
        <button className="quiz-student__restart" onClick={onRestart}>
          Intentar de nuevo
        </button>
      )}
    </div>
  )
}

export default QuizResult
