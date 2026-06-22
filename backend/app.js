const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors());
app.use(express.json());

//Rutas
const authRouter = require("./routes/auth")
const availabilityRouter = require("./routes/availability");
const reservationRouter = require('./routes/reservation');
const moduleRouter = require('./routes/module')

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/availability", availabilityRouter)
app.use("/api/v1/reservation", reservationRouter)
app.use("/api/v1/module", moduleRouter)


module.exports = app