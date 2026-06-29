const { Schema, model } = require('mongoose')

const quizSchema = new Schema({
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: String, required: true },
        explanation: { type: String }
    }]
}, { timestamps: true })


const Quiz = model('Quiz', quizSchema)
module.exports = Quiz