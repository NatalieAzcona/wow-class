const { Schema, model } = require('mongoose')

const availabilitySchema = new Schema (
    {
        teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startTime: {type: Date, required: true},
        endTime: {type: Date, required: true},
        subject: {type: String, enum: ["inglés", "matemáticas"]},
        isBooked: {type: Boolean, default: false},

    },
    {
        timestamps: true,
    }
)


//Model
const Availability = model('Availability', availabilitySchema)
module.exports = Availability