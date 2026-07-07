const express = require("express");
const {createQuiz, getQuiz, getQuizById, getQuizByModule, updateQuiz, deleteQuiz} = require("../controllers/quiz.controller")
const { isAuth, isTeacherOrAdmin } = require("../middlewares/auth")

const quizRouter = express.Router()

quizRouter.post("/", isAuth, isTeacherOrAdmin, createQuiz)
quizRouter.get("/", isAuth, getQuiz)
quizRouter.get("/module/:moduleId", isAuth, getQuizByModule)
quizRouter.get("/:id", isAuth, getQuizById)
quizRouter.put("/:id", isAuth, isTeacherOrAdmin, updateQuiz)
quizRouter.delete("/:id", isAuth, isTeacherOrAdmin, deleteQuiz)

module.exports = quizRouter