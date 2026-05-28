const express = require("express");
const { postRegister, loginUser } = require("../controllers/auth.controller");
const { googleAuth, googleCallback } = require("../controllers/google.controller");

const authRouter = express.Router()

authRouter.post("/register", postRegister);
authRouter.post("/login", loginUser)
authRouter.get("/google", googleAuth)
authRouter.get("/google/callback", googleCallback)

module.exports = authRouter
