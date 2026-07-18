import React from 'react'

const QuizFeedback = ({ isCorrect, explanation }) => (
  <div className={`quiz-student__feedback${isCorrect ? ' quiz-student__feedback--correct' : ' quiz-student__feedback--wrong'}`}>
    {isCorrect ? (
      <>
        <span>¡Correcto!</span>
        {explanation && <p>{explanation}</p>}
      </>
    ) : (
      <span>Incorrecto, sigue intentando</span>
    )}
  </div>
)

export default QuizFeedback
