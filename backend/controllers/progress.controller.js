const Progress = require('../models/Progress')

const getProgress = async (req, res) => {
  try {
    const records = await Progress.find({ student: req.user.id }, 'module')
    const completedModules = records.map(r => r.module.toString())
    res.status(200).json(completedModules)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener progreso' })
  }
}

const completeModule = async (req, res) => {
  try {
    const { moduleId } = req.params
    await Progress.findOneAndUpdate(
      { student: req.user.id, module: moduleId },
      { student: req.user.id, module: moduleId },
      { upsert: true, new: true }
    )
    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar progreso' })
  }
}

module.exports = { getProgress, completeModule }
