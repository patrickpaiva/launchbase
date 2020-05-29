const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {

        Chef.allChefs(function(chefs){
            return res.render("index", {chefs})

        })

    },
    about(req, res) {
        return res.render("about")
    },
    showAll(req, res) {
        Chef.allChefs(function(chefs){
            return res.render("chefs", {chefs})

        })
    },
    async show(req, res) {
        const chef = await Chef.find(req.params.id)

        const recipes = await Chef.findChefsRecipes(req.params.id)

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)

            const files = results.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipeFilesPromises = recipes.map(async recipe => {
            recipe.photo = await getImage(recipe.id)
            return recipe
        })

        const allRecipes = await Promise.all(recipeFilesPromises)
        
        return res.render("chef", { chef, recipes: allRecipes })
        // Chef.find(req.params.id, function(chef) {

        //     Chef.findChefsRecipes(req.params.id, function(recipes){

        //     })
            
        // })
    },
    async admchef(req, res) {
        const chef = await Chef.find(req.params.id)

        const recipes = await Chef.findChefsRecipes(req.params.id)

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)

            const files = results.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipeFilesPromises = recipes.map(async recipe => {
            recipe.photo = await getImage(recipe.id)
            return recipe
        })

        const allRecipes = await Promise.all(recipeFilesPromises)
        
        return res.render("admin/chefs/chef-admpanel", { chef, recipes: allRecipes })
    },
    admpanel(req, res) {
        Chef.allChefs(function(chefs){
            return res.render("admin/chefs/adm-panel", {chefs})

        })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }
    
        Chef.create(req.body, function(){
            return res.redirect(`/admin/chefs`)
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

             
        Chef.update(req.body, function(){
            return res.redirect(`/admin/chefs`)
        })
    },
    edit(req, res) {
        Chef.find(req.params.id, function(chef){
            return res.render(`admin/chefs/edit`, { chef })
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function(){
            return res.redirect('/admin/chefs')
        })
    }
}