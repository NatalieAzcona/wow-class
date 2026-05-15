const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors());
app.use(express.json());

//Rutas
const authRouter = require("./routes/auth")
const availabilityRouter = require("./routes/availability")

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/availability", availabilityRouter)


module.exports = app