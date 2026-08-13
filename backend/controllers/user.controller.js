const User = require('../models/User')

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }, 'name email level plan _id')
    res.status(200).json(students)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes' })
  }
}

const updateStudentPlan = async (req, res) => {
  try {
    const { id } = req.params
    const { plan } = req.body
    const updated = await User.findByIdAndUpdate(id, { plan }, { new: true, select: 'name email level plan' })
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar plan' })
  }
}

const updateStudentLevel = async (req, res) => {
  try {
    const { id } = req.params
    const { level } = req.body
    const updated = await User.findByIdAndUpdate(id, { level }, { new: true, select: 'name email level plan' })
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar nivel' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, address, phone, level } = req.body
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, address, phone, level },
      { new: true, select: 'name email role subject address phone level' }
    )
    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' })
  }
}

module.exports = { getStudents, updateProfile, updateStudentPlan, updateStudentLevel }
