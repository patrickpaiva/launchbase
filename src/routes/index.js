const express = require('express')
const routes = express.Router()
const RecipesController = require('../app/controllers/RecipesController')
const ChefsController = require('../app/controllers/ChefsController')
const HomeController = require('../app/controllers/HomeController');
const { onlyUsers, isAdmin } = require('../app/middlewares/session');


const recipesRoutes = require('./recipes.routes')
const chefsRoutes = require('./chefs.routes')
const userRoutes = require('./users.routes');

routes.use('/admin/recipes', onlyUsers, recipesRoutes)
routes.use('/admin/chefs', onlyUsers, isAdmin, chefsRoutes)
routes.use('/users', userRoutes)

routes.get("/", HomeController.index)
routes.get("/about", HomeController.about)
routes.get("/not-found", HomeController.notFound)
routes.get("/error", HomeController.errorPage)
routes.get("/search", RecipesController.search)

//chefs pages
routes.get("/chefs", ChefsController.showAll)
routes.get("/chefs/:id", ChefsController.show)

// recipes pages
routes.get("/recipes", RecipesController.showAll)
routes.get("/recipes/:id", RecipesController.show)




module.exports = routes
