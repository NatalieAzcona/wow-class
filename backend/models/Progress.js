const { Schema, model } = require('mongoose')

const progressSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  },
  { timestamps: true }
)

progressSchema.index({ student: 1, module: 1 }, { unique: true })

const Progress = model('Progress', progressSchema)
module.exports = Progress
