const express = require('express')
const { getProgress, completeModule } = require('../controllers/progress.controller')
const { isAuth } = require('../middlewares/auth')

const progressRouter = express.Router()

progressRouter.get('/', isAuth, getProgress)
progressRouter.post('/:moduleId', isAuth, completeModule)

module.exports = progressRouter
