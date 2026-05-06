const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors());
app.use(express.json());

//Rutas
const authRouter = require("./routes/auth")

app.use("/api/v1/auth", authRouter)

module.exports = app