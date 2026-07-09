const { Schema, model } = require('mongoose')

const reservationSchema = new Schema (
    {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        availability : {type: Schema.Types.ObjectId, ref: 'Availability', required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ["pendiente", "confirmada", "rechazada"]},
        meetLink: { type: String },
        mode: { type: String, enum: ["presencial", "online"] }
    },
    {
        timestamps: true,
    }
)


//Model
const Reservation = model('Reservation', reservationSchema)
module.exports = Reservation