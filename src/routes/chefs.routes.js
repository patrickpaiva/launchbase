const express = require('express')
const routes = express.Router()
const ChefsController = require('../app/controllers/ChefsController')
const multer = require('../app/middlewares/multer')


// chefs admin pages
routes.get("/create", ChefsController.create)
routes.get("/:id", ChefsController.admChefShow)
routes.get("/", ChefsController.admChefsList)
routes.post("/", multer.array("avatar_image", 1), ChefsController.post)
routes.get("/:id/edit", ChefsController.edit)
routes.put("/", multer.array("avatar_image", 1), ChefsController.put)
routes.delete("/", ChefsController.delete)

module.exports = routes
