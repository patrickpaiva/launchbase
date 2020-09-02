const express = require('express')
const routes = express.Router()
const RecipesController = require('../app/controllers/RecipesController')
const multer = require('../app/middlewares/multer')


// recipes admin pages
routes.get("/create", RecipesController.create)
routes.get("/:id/recipes-admpanel", RecipesController.admRecipeShow)
routes.get("/", RecipesController.admRecipesList)
routes.post("/", multer.array("photos", 5), RecipesController.post)
routes.get("/:id/edit", RecipesController.edit)
routes.put("/:id", multer.array("photos", 5), RecipesController.put)
routes.delete("/:id", RecipesController.delete)



module.exports = routes
