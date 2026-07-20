const Availability = require("../models/Availability");
const Reservation = require("../models/Reservation");


const createAvailability = async (req, res, next) => {
    try {
        const {startTime, endTime, subject} = req.body

        if(!startTime || !endTime || !subject) {
            return  res.status(400).json({message: "Faltan datos por rellenar" })
        }

        const newAvailability = new Availability({
            teacher: req.user._id,
            startTime,
            endTime,
            subject
        })

        const savedAvailability = await newAvailability.save()
        return res.status(201).json(savedAvailability);

} catch (error) {
    return res.status(500).json({
        message: "Error al crear disponibilidad"
    })
}
}

const getAvailability = async (req, res ) => {
    try {
        if (req.user.role === 'teacher') {
            const daysAvailable = await Availability.find({ teacher: req.user._id })
            return res.status(200).json(daysAvailable);
          } else {
            const studentId = req.user._id
            const allReservations = await Reservation.find({ status: { $in: ['pendiente', 'confirmada'] } })
            const myReservations = await Reservation.find({ student: studentId, status: { $in: ['pendiente', 'confirmada'] } })
            const myAvailabilityIds = myReservations.map(r => r.availability.toString())
            const otherReservedIds = allReservations
              .filter(r => !myAvailabilityIds.includes(r.availability.toString()))
              .map(r => r.availability.toString())
            const daysAvailable = await Availability.find({ _id: { $nin: otherReservedIds } })
            return res.status(200).json(daysAvailable);
          }
          
    } catch (error) {
        return res.status(500).json({ message: "error al obtener días disponibles"});
    }
}


const deleteAvailability = async (req, res ) => {
    try {
        const daysToDelete = req.params.id

        await Availability.findByIdAndDelete(daysToDelete)

        return res.status(200).json({message: `Días eliminados con éxito: ${daysToDelete}` })
    } catch (error) {
        return res.status(500).json({message: "Error al eliminar disponibilidad" })
    }
}


module.exports = {createAvailability, getAvailability, deleteAvailability}


