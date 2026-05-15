const express = require("express");
const {createAvailability, getAvailability, updateAvailability, deleteAvailability} = require("../controllers/availability.controller")
const { isAuth, isTeacherOrAdmin } = require("../middlewares/auth")

const availabilityRouter = express.Router()

availabilityRouter.post("/", isAuth, isTeacherOrAdmin, createAvailability);
//availabilityRouter.get("/", isAuth, isTeacherOrAdmin, getAvailability)
//availabilityRouter.put("/:id", isAuth, isTeacherOrAdmin, updateAvailability)
//availabilityRouter.delete("/:id", isAuth, isTeacherOrAdmin, deleteAvailability)

module.exports = availabilityRouter