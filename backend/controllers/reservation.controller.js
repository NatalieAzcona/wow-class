const Reservation = require("../models/Reservation")
const User = require("../models/User")
const Availability = require("../models/Availability")
const oauth2Cliente = require("../config/google")
const { google } = require('googleapis')
const transporter = require("../config/nodemailer")



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

        if (status === "confirmada") {
            const reservation = await Reservation.findById(id)
            const teacher = await User.findById(reservation.teacher)
            const slot = await Availability.findById(reservation.availability)

            oauth2Cliente.setCredentials({
                access_token: teacher.googleAccessToken,
                refresh_token: teacher.googleRefreshToken
            })
            
            const calendar = google.calendar({ version: 'v3', auth: oauth2Cliente })

            const event = await calendar.events.insert({
                calendarId: 'primary',
                conferenceDataVersion: 1,
                requestBody: {
                    summary: 'Clase Wöw Class',
                    start: { dateTime: slot.startTime },
                    end: { dateTime: slot.endTime },
                    conferenceData: {
                        createRequest: { requestId: id }
                    }
                }
            })

            const meetLink = event.data.conferenceData.entryPoints[0].uri
            await Reservation.findByIdAndUpdate(id, { meetLink })

            const finalReservation = await Reservation.findById(id)


            const student = await User.findById(reservation.student)
            
            let info = await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: student.email,
                subject: "Tu clase está confirmada",
                html: ` 
                    <h2>¡Tu clase de ${slot.subject} con ${teacher.name} está confirmada! </h2>
                    <p>Ya puedes acceder a tu clase en el siguiente enlace:</p>
                    <a href="${meetLink}" style="background:#2E5FA3;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
                        Unirse a la clase
                    </a>
                    <p>¡Hasta pronto!</p>
                    `
            })
            

            res.status(200).json(finalReservation)
            
        }else {
            res.status(200).json(updatedReservation)
        }
        

    } catch (error) {
        console.log(error)
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