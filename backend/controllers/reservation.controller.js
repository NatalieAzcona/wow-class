const Reservation = require("../models/Reservation")
const User = require("../models/User")
const Availability = require("../models/Availability")
const oauth2Cliente = require("../config/google")
const { google } = require('googleapis')
const transporter = require("../config/nodemailer")

const sendConfirmation = async (reservationId) => {
    const reservation = await Reservation.findById(reservationId)
    const teacher = await User.findById(reservation.teacher)
    const student = await User.findById(reservation.student)
    const slot = await Availability.findById(reservation.availability)
    const dateStr = new Date(slot.startTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })

    let meetLink = null

    if (reservation.mode === 'online') {
        try {
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
                    conferenceData: { createRequest: { requestId: reservationId.toString() } }
                }
            })
            meetLink = event.data.conferenceData.entryPoints[0].uri
            await Reservation.findByIdAndUpdate(reservationId, { meetLink })
        } catch (err) {
            console.error('Google Calendar error:', err.message)
        }

        if (!meetLink) return await Reservation.findById(reservationId)
    }

    const meetButton = meetLink
        ? `<div style="text-align:center;margin:32px 0;">
               <a href="${meetLink}" style="background:#ff7aac;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;font-weight:bold;">
                   Unirse a la clase
               </a>
           </div>`
        : ''

    const modeLabel = reservation.mode === 'online' ? 'Online' : 'Presencial'

    const template = (intro) => `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff0f7;border-radius:16px;overflow:hidden;">
            <div style="background:#141414;padding:32px;text-align:center;">
                <h1 style="color:white;margin:0;font-size:28px;letter-spacing:1px;">WöW Class</h1>
            </div>
            <div style="padding:32px;">
                <h2 style="color:#141414;margin-top:0;">¡Clase confirmada!</h2>
                <p style="color:#444;font-size:16px;">${intro}</p>
                <p style="color:#444;font-size:16px;"><strong>${dateStr}</strong></p>
                <p style="color:#444;font-size:16px;">Formato: ${modeLabel}</p>
                ${meetButton}
                <p style="color:#888;font-size:14px;text-align:center;">¡Hasta pronto! El equipo de WöW Class 🎉</p>
            </div>
        </div>
    `

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: student.email,
        subject: '¡Tu clase está confirmada! — WöW Class',
        html: template(`Tienes clase de <strong>${slot.subject}</strong> con <strong>Prof. ${teacher.name}</strong>`)
    })

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: teacher.email,
        subject: 'Nueva clase confirmada — WöW Class',
        html: template(`Tienes clase de <strong>${slot.subject}</strong> con <strong>${student.name}</strong>`)
    })

    return await Reservation.findById(reservationId)
}

const createReservation = async (req, res) => {
    try {
        const { availability, mode } = req.body
        const isTeacher = req.user.role === 'teacher'
        const student = isTeacher ? req.body.student : req.user.id
        const teacher = isTeacher ? req.user.id : req.body.teacher
        const status = isTeacher ? 'confirmada' : 'pendiente'

        const existing = await Reservation.findOne({ availability })
        if (existing) return res.status(409).json({ message: 'Ya existe una reserva para este horario' })

        const newReservation = new Reservation({ student, availability, teacher, status, mode })
        const savedReservation = await newReservation.save()

        if (isTeacher) {
            const finalReservation = await sendConfirmation(savedReservation._id)
            return res.status(201).json(finalReservation)
        }

        return res.status(201).json(savedReservation)

    } catch (error) {
        return res.status(500).json({ message: "Error al crear reserva" })
    }
}

const getReservation = async (req, res) => {
    try {
        const { id, role } = req.user
        const reservations = role === "teacher"
            ? await Reservation.find({ teacher: id })
                .populate('student', 'name email address')
                .populate('availability', 'startTime endTime')
            : await Reservation.find({ student: id }).populate('teacher', 'name')

        return res.status(200).json(reservations)

    } catch (error) {
        return res.status(500).json({ message: "Error al leer reservas" })
    }
}

const updateReservation = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        await Reservation.findByIdAndUpdate(id, { status }, { new: true })

        if (status === "confirmada") {
            const finalReservation = await sendConfirmation(id)
            return res.status(200).json(finalReservation)
        }

        const updatedReservation = await Reservation.findById(id)
        return res.status(200).json(updatedReservation)

    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar reserva" })
    }
}

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params
        const deletedReservation = await Reservation.findByIdAndDelete(id)
        res.status(200).json(deletedReservation)
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar reserva" })
    }
}

module.exports = { createReservation, getReservation, updateReservation, deleteReservation }
