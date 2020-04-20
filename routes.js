const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/recipes')


routes.get("/", recipes.index)

routes.get("/sobre", recipes.about)
routes.get("/receitas", recipes.showAll)
routes.get("/recipes/:id", recipes.show)
routes.get("/admin/recipes/create", recipes.create);
routes.post("/admin/recipes", recipes.post)

routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.put("/admin/recipes/:id", recipes.put);
routes.delete("/admin/recipes/:id", recipes.delete);

module.exports = routes
