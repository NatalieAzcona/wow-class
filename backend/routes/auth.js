const express = require("express");
const { postRegister, loginUser } = require("../controllers/auth.controller");

const authRouter = express.Router()

authRouter.post("/register", postRegister);
authRouter.post("/login", loginUser)

module.exports = authRouter