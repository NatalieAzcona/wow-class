import React, { useState } from 'react'
import QuizResult from './QuizResult'
import QuizFeedback from './QuizFeedback'
import './QuizStudent.scss'

const QuizStudent = ({ quiz }) => {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = quiz.questions
  const question = questions[current]
  const answered = selected !== null
  const isCorrect = answered && selected === question.correctAnswer

  const handleSelect = (opt) => {
    if (answered) return
    if (opt === question.correctAnswer) setScore(s => s + 1)
    setSelected(opt)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) return <QuizResult score={score} total={questions.length} onRestart={handleRestart} />

  return (
    <div className="quiz-student">
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
          Siguiente →
        </button>
      )}
    </div>
  )
}

export default QuizStudent
