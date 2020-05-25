const Recipe = require('../models/recipe')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {

        Recipe.allRecipes(function(recipes){
            return res.render("index", {recipes})

        })

    },
    about(req, res) {
        return res.render("about")
    },
    showAll(req, res) {
        Recipe.allRecipes(function(recipes){
            return res.render("recipes", {recipes})

        })
    },
    show(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("recipe not found!")
            
            recipe.created_at = date(recipe.created_at).format

            return res.render("recipe", { recipe })
        })
    },
    admrecipe(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("recipe not found!")
            
            recipe.created_at = date(recipe.created_at).format

            return res.render("admin/recipes/recipes-adm", { recipe })
        })
    },
    admpanel(req, res) {
        Recipe.allRecipes(function(recipes){
            return res.render("admin/recipes/adm-panel", {recipes})

        })
    },
    create(req, res) {

        Recipe.chefSelectOptions(function(options){

            return res.render('admin/recipes/create', { chefOption: options })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }
    
        Recipe.create(req.body, function(recipe){
            return res.redirect(`/recipes/${recipe.id}`)
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

             
        Recipe.update(req.body, function(){
            return res.redirect(`/admin/recipes/${req.body.id}/recipes-admpanel`)
        })
    },
    edit(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("recipe not found!")
            
            recipe.created_at = date(recipe.created_at).format

            Recipe.chefSelectOptions(function(options){
                
                return res.render("admin/recipes/edit", { recipe, chefOption: options })
                
            })

        })
    },
    delete(req, res) {
        Recipe.delete(req.body.id, function(){
            return res.redirect('/admin/recipes/adm-panel')
        })
    },
    search(req, res) {
        const { search } = req.query

        if ( search ) {

            Recipe.findBy(search, function(recipes) {
                return res.render("search", {recipes, search})
            })

        } else {
            Recipe.allRecipes(function(recipes){
                return res.render("search", {recipes, search})
    
            })
        }
    }
}