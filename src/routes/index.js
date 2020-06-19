const express = require('express')
const routes = express.Router()
const recipes = require('../app/controllers/recipes')
const chefs = require('../app/controllers/chefs')

const recipesRoutes = require('./recipes')
const chefsRoutes = require('./chefs')
const user = require('./users')

routes.use('/admin/recipes', recipesRoutes)
routes.use('/admin/chefs', chefsRoutes)
routes.use('/users', user)

routes.get("/", recipes.index)
routes.get("/about", recipes.about)
routes.get("/search", recipes.search)

//chefs pages
routes.get("/chefs", chefs.showAll)
routes.get("/chefs/:id", chefs.show)

// recipes pages
routes.get("/recipes", recipes.showAll)
routes.get("/recipes/:id", recipes.show)




module.exports = routes
