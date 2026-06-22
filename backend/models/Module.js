const { Schema, model } = require('mongoose')

const moduleSchema = new Schema (
    {
        title: {type: String, required: true},           
        subject: {type: String, enum: ["inglés", "matemáticas"], required: true},
        level: {type: String, enum: ["1 Primaria", "2 Primaria", "3 Primaria", "4 Primaria", "5 Primaria", "6 Primaria", "1 ESO", "2 ESO", "3 ESO", "4 ESO", "1 Bachillerato", "2 Bachillerato"], required: true},          
        content: {type: String},         
        videoUrl: {type: String},       
        quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz'}]},
    {
        timestamps: true,
    }
)

const Module = model('Module', moduleSchema)
module.exports = Module