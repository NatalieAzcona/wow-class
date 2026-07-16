const express = require("express");
const {createQuiz, getQuizById, getQuizByModule, updateQuiz, deleteQuiz} = require("../controllers/quiz.controller")
const { isAuth, isTeacher } = require("../middlewares/auth")

const quizRouter = express.Router()

quizRouter.post("/", isAuth, isTeacher, createQuiz)

quizRouter.get("/module/:moduleId", isAuth, getQuizByModule)
quizRouter.get("/:id", isAuth, getQuizById)
quizRouter.put("/:id", isAuth, isTeacher, updateQuiz)
quizRouter.delete("/:id", isAuth, isTeacher, deleteQuiz)

module.exports = quizRouter