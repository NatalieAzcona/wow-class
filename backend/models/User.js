const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true}, //unique para no dulplicar email
        password: {type: String, required: true, trim: true, minlength: [8, "8 caracteres mínimo"]},
        role: {type: String, enum: ["student", "teacher", "admin"], default: "student"},
        avatar: {type: String, trim: true},
        subject: {type: String, enum: ["inglés", "matemáticas"]},
        birthDate: {type: Date},
        parentsConsent: {type: Boolean, default: false}

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


//dentro del presave, this es el documento. isModified es metodo 