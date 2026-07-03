const express = require("express");
const { postRegister, loginUser, getMe } = require("../controllers/auth.controller");
const { isAuth } = require("../middlewares/auth");
const { googleAuth, googleCallback, disconnectGoogle } = require("../controllers/google.controller");

const authRouter = express.Router()

authRouter.post("/register", postRegister);
authRouter.post("/login", loginUser)
authRouter.get("/me", isAuth, getMe)
authRouter.get("/google", googleAuth)
authRouter.get("/google/callback", googleCallback)
authRouter.delete("/google", isAuth, disconnectGoogle)

module.exports = authRouter
