const express = require('express')
const { getStudents, updateProfile, updateStudentPlan, updateStudentLevel } = require('../controllers/user.controller')
const { isAuth, isTeacher } = require('../middlewares/auth')

const usersRouter = express.Router()

usersRouter.get('/students', isAuth, isTeacher, getStudents)
usersRouter.put('/profile', isAuth, updateProfile)
usersRouter.patch('/:id/plan', isAuth, isTeacher, updateStudentPlan)
usersRouter.patch('/:id/level', isAuth, isTeacher, updateStudentLevel)

module.exports = usersRouter
