const LoadRecipesService = require('../services/LoadRecipesService')

module.exports = {
  async index(req, res) {
    const recipes = await LoadRecipesService.load('recipes')

    return res.render("public/index", {recipes, session: req.session})
  },
  about(req, res) {
    return res.render("public/about", { session: req.session })
  },
  notFound(req, res) {
    return res.render("public/not-found")
  },
  errorPage(req, res) {
    return res.render("public/error")
  }
}