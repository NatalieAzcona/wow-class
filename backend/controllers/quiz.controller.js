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

const getQuiz = async (req, res) => {
    try { 
        const allQuizzes = await Quiz.find({})

        return res.status(200).json(allQuizzes)
    } catch (error) {
        return res.status(500).json({
            message: "Error al encontrar quizes"
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


module.exports = { createQuiz, getQuiz, getQuizById, updateQuiz, deleteQuiz}