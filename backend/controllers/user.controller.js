const User = require('../models/User')

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }, 'name email _id')
    res.status(200).json(students)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true, select: 'name email role subject address' }
    )
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' })
  }
}

module.exports = { getStudents, updateProfile }
