const Recipe = require('../models/recipe')
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
    async admRecipeShow(req, res) {

        let recipe = await Recipe.findOne(req.params.id)

        if (!recipe) throw new Error('Recipe not found');

        if (!req.session.isAdmin && recipe.user_id !== req.session.userId) {
            return res.send('Access Denied')
        }

        let files = await Recipe.files(recipe.id);

        files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

        return res.render("admin/recipes/recipes-adm", { recipe, files, isAdmin: req.session.isAdmin })

        // Recipe.find(req.params.id, function(recipe) {
        //     if (!recipe) return res.send("recipe not found!")
            
        //     recipe.created_at = date(recipe.created_at).format

        //     let files = await Recipe.files(recipe.id);

        //     files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    

        //     return res.render("admin/recipes/recipes-adm", { recipe, files })
        // })
    },
    async admRecipesList(req, res) {
        let recipes = await Recipe.allRecipes()
        
        if (!req.session.isAdmin) {
            recipes = recipes.filter(recipe => recipe.user_id === req.session.userId)
        }

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
                        
        return res.render("admin/recipes/adm-panel", {recipes: allRecipes, isAdmin: req.session.isAdmin})

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

            const user_id = req.session.userId

            const recipeValues = {
                ...req.body,
                user_id
            }

            if (req.files.length == 0 )
                return res.send('Please, send at least one image')
            
            let results = await Recipe.create(recipeValues)
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
                if (req.body[key] == "" && key != "removed_files") {
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

        if (!req.session.isAdmin && recipe.user_id !== req.session.userId) {
            return res.send('Access Denied')
        }

        let files = await Recipe.files(recipe.id);

        files = files.map(file => ({
            ...file,
            path: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        let chefOption = await Recipe.chefSelectOptions()

        return res.render("admin/recipes/edit", { recipe, files, chefOption })

    },
    async delete(req, res) {
        try {
            if (!req.session.isAdmin && recipe.user_id !== req.session.userId) {
                return res.send('Access Denied')
            }

            let files = await Recipe.files(req.body.id)

            const removingFiles = files.map(file => File.delete(file.file_id))
        
            await Promise.all(removingFiles)

            await Recipe.delete(req.body.id)
    
            return res.redirect('/admin/recipes')
        }
        catch(error) {
            console.error(error)
        }
        
    },
    async search(req, res) {
        try {
            const { search } = req.query

            if ( search ) {
                const recipes = await Recipe.findBy(search)
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
    
                return res.render("search", { recipes: allRecipes, search })
                // Recipe.findBy(search, function(recipes) {
                //     return res.render("search", {recipes, search})
                // })

            } else {
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
    
                return res.render("search", { recipes: allRecipes, search })

                // Recipe.allRecipes(function(recipes){
                //     return res.render("search", {recipes, search})
        
                // })
            }

        }
        catch (error) {
            console.error(error)
        }
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