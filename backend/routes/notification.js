const express = require('express')
const { getNotifications, markAllRead } = require('../controllers/notification.controller')
const { isAuth } = require('../middlewares/auth')

const notificationRouter = express.Router()

notificationRouter.get('/', isAuth, getNotifications)
notificationRouter.put('/read', isAuth, markAllRead)

module.exports = notificationRouter
