const express = require('express')
const routes = express.Router()
const recipes = require('../app/controllers/recipes')
const multer = require('../app/middlewares/multer')


// recipes admin pages
routes.get("/create", recipes.create)
routes.get("/:id/recipes-admpanel", recipes.admrecipe)
routes.get("/", recipes.admpanel)
routes.post("/", multer.array("photos", 5), recipes.post)
routes.get("/:id/edit", recipes.edit)
routes.put("/:id", multer.array("photos", 5), recipes.put)
routes.delete("/:id", recipes.delete)



module.exports = routes
