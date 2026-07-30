const Notification = require('../models/Notification')

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .limit(20)
    return res.status(200).json(notifications)
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener notificaciones' })
  }
}

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true })
    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({ message: 'Error al marcar notificaciones' })
  }
}

module.exports = { getNotifications, markAllRead }
