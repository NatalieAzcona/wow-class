import React, { useState } from 'react'
import QuizResult from './QuizResult'
import QuizFeedback from './QuizFeedback'
import './QuizStudent.scss'

const QuizStudent = ({ quiz, onPass, levelPath }) => {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const questions = quiz.questions
  const question = questions[current]
  const answered = selected !== null
  const isCorrect = answered && selected === question.correctAnswer

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
  }

  const handleNext = () => {
    const newAnswers = [...answers, { isCorrect: selected === question.correctAnswer }]
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers)
      setFinished(true)
      const passed = newAnswers.every(a => a.isCorrect)
      if (passed && onPass) onPass()
    } else {
      setAnswers(newAnswers)
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  if (finished) return (
    <QuizResult answers={answers} questions={questions} onRestart={handleRestart} levelPath={levelPath} />
  )

  return (
    <div className="quiz-student">
      <p className="quiz-student__progress">Pregunta {current + 1} de {questions.length}</p>
      <p className="quiz-student__question">{question.question}</p>

      <div className="quiz-student__options">
        {question.options.map((opt, i) => {
          let mod = ''
          if (answered && opt === selected) mod = isCorrect ? ' quiz-student__option--correct' : ' quiz-student__option--wrong'
          return (
            <button
              key={i}
              className={`quiz-student__option${mod}`}
              onClick={() => handleSelect(opt)}
              disabled={answered}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <QuizFeedback isCorrect={isCorrect} explanation={question.explanation} />
      )}

      {answered && (
        <button className="quiz-student__next" onClick={handleNext}>
          {current + 1 >= questions.length ? 'Ver resultado' : 'Siguiente →'}
        </button>
      )}
    </div>
  )
}

export default QuizStudent
