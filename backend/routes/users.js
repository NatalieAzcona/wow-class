const express = require('express')
const { getStudents, updateProfile } = require('../controllers/user.controller')
const { isAuth, isTeacherOrAdmin } = require('../middlewares/auth')

const usersRouter = express.Router()

usersRouter.get('/students', isAuth, isTeacherOrAdmin, getStudents)
usersRouter.put('/profile', isAuth, updateProfile)

module.exports = usersRouter
