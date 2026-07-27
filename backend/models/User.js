const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true}, 
        password: {type: String, required: true, trim: true, minlength: [8, "8 caracteres mínimo"]},
        role: {type: String, enum: ["student", "teacher"], default: "student"},
        subject: {type: String, enum: ["inglés", "matemáticas"]},
        parentsConsent: {type: Boolean, default: false},
        googleAccessToken: {type: String},
        googleRefreshToken: {type: String},
        googleEmail: {type: String},
        address: {type: String, trim: true},
        phone: {type: String, trim: true},
        level: {type: String, enum: ["1º de Primaria", "2º de Primaria", "3º de Primaria", "4º de Primaria", "5º de Primaria", "6º de Primaria", "1º de ESO", "2º de ESO", "3º de ESO", "4º de ESO", "1º de Bachillerato", "2º de Bachillerato"]}

    },
    {
        timestamps: true,
    }
)

// Encriptado de contraseña 
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})



//Model
const User = model('User', userSchema)
module.exports = User


