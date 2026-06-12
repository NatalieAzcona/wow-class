const express = require("express");
const {createReservation, getReservation, updateReservation, deleteReservation} = require("../controllers/reservation.controller")
const { isAuth, isTeacherOrAdmin } = require("../middlewares/auth")

const reservationRouter = express.Router()

reservationRouter.post("/", isAuth, createReservation);
reservationRouter.get("/", isAuth, getReservation)
reservationRouter.put("/:id", isAuth, isTeacherOrAdmin, updateReservation)
reservationRouter.delete("/:id", isAuth, deleteReservation)

module.exports = reservationRouter