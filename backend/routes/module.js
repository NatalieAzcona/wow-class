const express = require("express");
const {createModule, getModule, getModuleById, updateModule, deleteModule} = require("../controllers/module.controller")
const { isAuth, isTeacher } = require("../middlewares/auth")

const moduleRouter = express.Router()

moduleRouter.post("/", isAuth, isTeacher, createModule);
moduleRouter.get("/", isAuth, getModule)
moduleRouter.get("/:id", isAuth, getModuleById)
moduleRouter.put("/:id", isAuth, isTeacher, updateModule)
moduleRouter.delete("/:id", isAuth, isTeacher, deleteModule)

module.exports = moduleRouter