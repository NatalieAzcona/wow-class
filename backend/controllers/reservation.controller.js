const Reservation = require("../models/Reservation")


const createReservation = async (req, res) => {
    try {
        
        const {availability, teacher} = req.body
        const student = req.user.id
        const status = req.user.role === 'teacher' ? 'confirmada' : 'pendiente'
        
        const newReservation = new Reservation ({
            student: student,
            availability: availability,
            teacher: teacher,
            status: status
        })

        const savedReservation = await newReservation.save()
        return res.status(201).json(savedReservation);

    } catch (error) {
        return res.status(500).json({
            message: "Error al crear reserva"
        })
    }
}


const getReservation = async (req, res) => {
    try {
        const {id, role} = req.user
        const roleVerification = role === "teacher" ? await Reservation.find({teacher: id}) : await Reservation.find({student: id})

        return res.status(200).json(roleVerification);

    } catch (error) {
        return res.status(500).json({
            message: "Error al leer reservas"
        })
    }
}

const updateReservation = async (req, res) => {
    try {

        const {id} = req.params
        const {status} = req.body

        const updatedReservation = await Reservation.findByIdAndUpdate(id, {status}, {new: true})

        res.status(200).json(updatedReservation)
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar reserva"
        })
    }
}

const deleteReservation = async (req, res) => {
    try {
        const {id} = req.params

        const deletedReservation = await Reservation.findByIdAndDelete(id)
        res.status(200).json(deletedReservation)

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar reserva"
        })
    }
}

module.exports = {createReservation, getReservation,  updateReservation, deleteReservation }