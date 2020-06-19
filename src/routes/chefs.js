const express = require('express')
const routes = express.Router()
const chefs = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')


// chefs admin pages
routes.get("/create", chefs.create)
routes.get("/:id/chefs-admpanel", chefs.admchef)
routes.get("/", chefs.admpanel)
routes.post("/", multer.array("avatar_image", 1), chefs.post)
routes.get("/:id/edit", chefs.edit)
routes.put("/", multer.array("avatar_image", 1), chefs.put)
routes.delete("/", chefs.delete)

module.exports = routes
