const Avalaibility = require("../models/Availability");


const createAvailability = async (req, res, next) => {
    try {
        const {startTime, endTime, subject} = req.body
        
        if(!startTime || !endTime || !subject) {
            return  res.status(400).json({message: "Faltan datos por rellenar" })
        }
        
        const newAvalaibility = new Avalaibility ({
            teacher: req.user._id,
            startTime: startTime,
            endTime: endTime,
            subject: subject
        })

        const savedAvalaibility = await newAvalaibility.save()
        return res.status(201).json(savedAvalaibility);

} catch (error) {
    return res.status(500).json({
        message: "Error al crear usuario"
    })
}
}

module.exports = {createAvailability}


