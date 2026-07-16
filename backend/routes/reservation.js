const express = require("express");
const {createReservation, getReservation, updateReservation, deleteReservation} = require("../controllers/reservation.controller")
const { isAuth, isTeacher } = require("../middlewares/auth")

const reservationRouter = express.Router()

reservationRouter.post("/", isAuth, createReservation);
reservationRouter.get("/", isAuth, getReservation)
reservationRouter.put("/:id", isAuth, isTeacher, updateReservation)
reservationRouter.delete("/:id", isAuth, deleteReservation)

module.exports = reservationRouter