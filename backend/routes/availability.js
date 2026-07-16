const express = require("express");
const {createAvailability, getAvailability, deleteAvailability} = require("../controllers/availability.controller")
const { isAuth, isTeacher } = require("../middlewares/auth")

const availabilityRouter = express.Router()

availabilityRouter.post("/", isAuth, isTeacher, createAvailability);
availabilityRouter.get("/", isAuth, getAvailability)

availabilityRouter.delete("/:id", isAuth, isTeacher, deleteAvailability)

module.exports = availabilityRouter