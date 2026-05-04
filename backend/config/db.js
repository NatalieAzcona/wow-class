const mongoose = require('mongoose'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI) 
        console.log('Base de datos conectada')
    } catch (error) {
        console.log('Error al conectar la base de datos', error)
    }
}

module.exports = {connectDB};