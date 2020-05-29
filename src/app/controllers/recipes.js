const Recipe = require('../models/recipe')
const { date } = require('../../lib/utils')
const File = require('../models/File')


module.exports = {
    async index(req, res) {
        
        const recipes = await Recipe.allRecipes()

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
                        
        return res.render("index", {recipes: allRecipes})

    },
    about(req, res) {
        return res.render("about")
    },
    async showAll(req, res) {
        const recipes = await Recipe.allRecipes()

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
                        
        return res.render("recipes", {recipes: allRecipes})
    },
    async show(req, res) {
        try {
            let recipe = await Recipe.findOne(req.params.id)

            if (!recipe) throw new Error('Recipe not found');
    
            let files = await Recipe.files(recipe.id);
    
            files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
            return res.render("recipe", { recipe, files })
        }
        catch (error) {
            console.error(error)
        }
    },
    async admrecipe(req, res) {

        let recipe = await Recipe.findOne(req.params.id)

        if (!recipe) throw new Error('Recipe not found');

        let files = await Recipe.files(recipe.id);

        files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

        return res.render("admin/recipes/recipes-adm", { recipe, files })

        // Recipe.find(req.params.id, function(recipe) {
        //     if (!recipe) return res.send("recipe not found!")
            
        //     recipe.created_at = date(recipe.created_at).format

        //     let files = await Recipe.files(recipe.id);

        //     files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    

        //     return res.render("admin/recipes/recipes-adm", { recipe, files })
        // })
    },
    async admpanel(req, res) {

        const recipes = await Recipe.allRecipes()

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
                        
        return res.render("admin/recipes/adm-panel", {recipes: allRecipes})

    },
    async create(req, res) {
        
        let chefOption = await Recipe.chefSelectOptions()

        return res.render("admin/recipes/create", { chefOption })
        
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields')
                }
            }

            if (req.files.length == 0 )
                return res.send('Please, send at least one image')
            
            let results = await Recipe.create(req.body)
            const recipeId = results.rows[0].id

            const recipeFilesPromises = req.files.map((file) =>
                Recipe.createFile({ file, recipe_id: recipeId})
            )

            await Promise.all(recipeFilesPromises)

            return res.redirect(`/recipes/${recipeId}`)
        } catch (err) {
            return res.send(`Erro paia ${err}`)
        }

    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields')
                }
            }

            await Recipe.update(req.body)
            
            if (req.files.length != 0) {

                if (!req.files.id) {
                    const recipeFilesPromises = req.files.map((file) =>
                    Recipe.createFile({ file, recipe_id: req.body.id})
                    )
                    await Promise.all(recipeFilesPromises)
                }

            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
    
                await Promise.all(removedFilesPromise)
            }

            

            return res.redirect(`/admin/recipes/${req.body.id}/recipes-admpanel`)

            
        }
        catch (error) {
            console.error(error)
        }
                     
    },
    async edit(req, res) {
        
        let recipe = await Recipe.findOne(req.params.id)

        if (!recipe) throw new Error('Recipe not found');

        let files = await Recipe.files(recipe.id);

        files = files.map(file => ({
            ...file,
            path: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        let chefOption = await Recipe.chefSelectOptions()

        return res.render("admin/recipes/edit", { recipe, files, chefOption })

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