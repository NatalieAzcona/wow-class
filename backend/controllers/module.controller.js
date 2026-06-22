const Module = require("../models/Module")



const createModule = async (req, res, next) => {
    try {
        const {title, subject, level } = req.body

        const newModule = new Module ({
            title: title,
            subject: subject,
            level: level
        })

        const savedModule = await newModule.save()

        return res.status(201).json({
            message: "módulo creado", savedModule
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error al crear módulo"
        })
    }

}

const getModuleById = async (req, res, next) => {
    try {
        const {id} = req.params
        const module = await Module.findById(id)
        return res.status(200).json(module)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener módulo" })
    }
}


const getModule = async (req, res, next) => {
 
    try { 
        const allModules = await Module.find({})

        return res.status(200).json(allModules)
    } catch (error) {
        return res.status(500).json({
            message: "Error al encontrar módulos"
        })
    }
}

const updateModule = async (req, res, next) => {
    try {
        const {id} = req.params
    
        const {title, subject, level, content, videoUrl, quizzes} = req.body
    
        const updatedModule = await Module.findByIdAndUpdate(id, {title, subject, level, content, videoUrl, quizzes}, {new: true})
    
        res.status(200).json(updatedModule)

    } catch (error) {
        return res.status(500).json({
        message: "Error al actualizar módulo"
    })}
}


const deleteModule = async (req, res, next) => {

    try {
        const {id} = req.params

        const deletedModule = await Module.findByIdAndDelete(id)

        res.status(200).json(deletedModule)

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar módulo"
        })
    }

}

module.exports = {createModule, getModule,  updateModule, deleteModule, getModuleById }