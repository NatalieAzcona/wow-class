const Quiz = require("../models/Quiz")


const createQuiz = async (req, res) => {
    try {
        const {module, questions} = req.body

        const newQuiz = new Quiz ({
            module: module,
            questions: questions
        })

        const savedQuiz = await newQuiz.save()

        return res.status(201).json({
            message: "Quiz creado", savedQuiz
        })

        
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear quiz"
        })
    }
}

const getQuizById = async (req, res) => {
    try {
        const {id} = req.params
        const quiz = await Quiz.findById(id)
        return res.status(200).json(quiz)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener quiz" })
    }
}

const getQuizByModule = async (req, res) => {
    try {
        const { moduleId } = req.params
        const quiz = await Quiz.findOne({ module: moduleId })
        return res.status(200).json(quiz)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener quiz del módulo" })
    }
}


const updateQuiz = async (req, res) => {
    try {
        const {id} = req.params
    
        const {module, questions} = req.body
    
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, {module, questions}, {new: true})
    
        res.status(200).json(updatedQuiz)

    } catch (error) {
        return res.status(500).json({
        message: "Error al actualizar quiz"
    })}
}

const deleteQuiz = async (req, res) => {
    try {
        const {id} = req.params

        const deletedQuiz = await Quiz.findByIdAndDelete(id)

        res.status(200).json(deletedQuiz)

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar quiz"
        })
    }
}


module.exports = { createQuiz, getQuizById, getQuizByModule, updateQuiz, deleteQuiz}