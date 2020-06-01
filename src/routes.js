const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const multer = require('./app/middlewares/multer')



routes.get("/", recipes.index)

routes.get("/about", recipes.about)
routes.get("/recipes", recipes.showAll)
routes.get("/recipes/:id", recipes.show)
routes.get("/chefs", chefs.showAll)
routes.get("/chefs/:id", chefs.show)
routes.get("/search", recipes.search)

routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id/recipes-admpanel", recipes.admrecipe)
routes.get("/admin/recipes", recipes.admpanel)
routes.post("/admin/recipes", multer.array("photos", 5), recipes.post)
routes.get("/admin/recipes/:id/edit", recipes.edit)
routes.put("/admin/recipes/:id", multer.array("photos", 5), recipes.put)
routes.delete("/admin/recipes/:id", recipes.delete)

routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id/chefs-admpanel", chefs.admchef)
routes.get("/admin/chefs", chefs.admpanel)
routes.post("/admin/chefs", multer.array("avatar_image", 1), chefs.post)
routes.get("/admin/chefs/:id/edit", chefs.edit)
routes.put("/admin/chefs", multer.array("avatar_image", 1), chefs.put)
routes.delete("/admin/chefs", chefs.delete)

module.exports = routes
