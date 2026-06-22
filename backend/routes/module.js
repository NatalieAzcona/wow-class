const express = require("express");
const {createModule, getModule, getModuleById, updateModule, deleteModule} = require("../controllers/module.controller")
const { isAuth, isTeacherOrAdmin } = require("../middlewares/auth")

const moduleRouter = express.Router()

moduleRouter.post("/", isAuth, isTeacherOrAdmin, createModule);
moduleRouter.get("/", isAuth, getModule)
moduleRouter.get("/:id", isAuth, getModuleById)
moduleRouter.put("/:id", isAuth, isTeacherOrAdmin, updateModule)
moduleRouter.delete("/:id", isAuth, isTeacherOrAdmin, deleteModule)

module.exports = moduleRouter