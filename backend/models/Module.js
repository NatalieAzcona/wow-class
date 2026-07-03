const { Schema, model } = require('mongoose')

const moduleSchema = new Schema (
    {
        title: {type: String, required: true},           
        subject: {type: String, enum: ["inglés", "matemáticas"], required: true},
        level: {type: String, enum: ["1º de Primaria", "2º de Primaria", "3º de Primaria", "4º de Primaria", "5º de Primaria", "6º de Primaria", "1º de ESO", "2º de ESO", "3º de ESO", "4º de ESO", "1º de Bachillerato", "2º de Bachillerato"], required: true},          
        content: {type: String},         
        videoUrl: {type: String},       
        quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz'}]},
    {
        timestamps: true,
    }
)

const Module = model('Module', moduleSchema)
module.exports = Module