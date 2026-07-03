const mongoose = require("mongoose")
const fs = require("fs")
const Module = require("../models/Module")
require("dotenv").config({ path: '../.env' })


const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Conectado a MongoDB")

    const csvIngles = fs.readFileSync('./modules_ingles.csv', 'utf-8')

    const lines = csvIngles.split('\n').slice(1).filter(line => line.trim() !== '')

    const modules = lines.map(line => {
    const [title, subject, level] = line.split(',')
    return { title, subject, level }
        
    })
    const csvMates = fs.readFileSync('./modules_mates.csv', 'utf-8')
    const linesMates = csvMates.split('\n').slice(1).filter(line => line.trim() !== '')
    const modulesMates = linesMates.map(line => {
        const [title, subject, level] = line.split(',')
        return { title, subject, level }
    })

    await Module.deleteMany({})
    console.log("Módulos anteriores eliminados")
    await Module.insertMany([...modules, ...modulesMates])
    console.log("Módulos insertados")

    await mongoose.disconnect()
    console.log("Desconectado")


}

seed()
