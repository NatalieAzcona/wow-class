const User = require("../models/User");
const { generateToken } = require("../utils/token");
const bcrypt = require('bcrypt')



const postRegister = async (req, res, next) => {

    try {
        const {name, email, password } = req.body;

        if(!name || !email || !password) {
            return  res.status(400).json({message: "Faltan datos por rellenar" })
        }

        if (typeof name !== 'string') {
            return res.status(400).json({message: "El usuario debe ser una cadena de texto"})
        }

        if (typeof password !== 'string') {
            return res.status(400).json({message: "La contraseña debe ser texto"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "La contraseña debe tener al menos 6 caracteres"})
        }

        if (await User.findOne({email})) {
            return res.status(400).json({message: "Este email ya está registrado en la base de datos"})
        }

        const newUser = new User({
            name,
            email,
            password,
        })

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser)
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear usuario"
        })
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Falta email o contraseña" });
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "Usuario no encontrado"})
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }  

        const token = generateToken(user._id) 
        
        const userWithoutPassword = user.toObject();   // paso a objeto porque Mongo devuelve docu, para poder eliminar la passw
        delete userWithoutPassword.password;


        return res.status(200).json({token, user: userWithoutPassword})
    } catch (error) {
        return res.status(500).json("Error en el login")
    }
}

module.exports = {postRegister, loginUser}