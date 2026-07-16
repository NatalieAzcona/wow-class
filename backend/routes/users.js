const express = require('express')
const { getStudents, updateProfile } = require('../controllers/user.controller')
const { isAuth, isTeacher } = require('../middlewares/auth')

const usersRouter = express.Router()

usersRouter.get('/students', isAuth, isTeacher, getStudents)
usersRouter.put('/profile', isAuth, updateProfile)

module.exports = usersRouter
