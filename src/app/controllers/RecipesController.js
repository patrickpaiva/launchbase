const Recipe = require('../models/Recipe')
const File = require('../models/File')
const LoadRecipesService = require('../services/LoadRecipesService')
const fs = require('fs')


module.exports = {
    async showAll(req, res) {
        try {
            const recipes = await LoadRecipesService.load('recipes')

            return res.render("public/recipes", {recipes, session: req.session})
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async show(req, res) {
        try {
            let recipe = await Recipe.findOneRecipe(req.params.id)

            if (!recipe) {
                return res.redirect('/not-found')
            }
    
            let files = await Recipe.files(recipe.id);
    
            files = files.map(file => `${file.path}`)
    
            return res.render("public/recipe", { recipe, files, isAdmin: req.session.isAdmin })
        }
        catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async admRecipeShow(req, res) {
        try {
            let recipe = await Recipe.findOneRecipe(req.params.id)
    
            if (!recipe) {
                return res.redirect('/not-found')
            }
    
            if (!req.session.isAdmin && recipe.user_id !== req.session.userId) {
                return res.send('Access Denied')
            }
    
            let files = await Recipe.files(recipe.id);
    
            files = files.map(file => `${file.path}`)
    
            return res.render("admin/recipes/show", { recipe, files, isAdmin: req.session.isAdmin })
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }

    },
    async admRecipesList(req, res) {
        try {
            let recipes = await LoadRecipesService.load('recipes')

            if (!req.session.isAdmin) {
                recipes = recipes.filter(recipe => recipe.user_id === req.session.userId)
            }
            return res.render("admin/recipes/recipes", {recipes, isAdmin: req.session.isAdmin})
            
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async create(req, res) {
        
        let chefOption = await Recipe.chefSelectOptions()

        return res.render("admin/recipes/create", { chefOption, isAdmin: req.session.isAdmin })
        
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields')
                }
            }

            const { ingredients, preparation } = req.body

            const recipeValues = {
                ...req.body,
                ingredients: `{${ingredients}}`,
                preparation: `{${preparation}}`,
                user_id: req.session.userId
            }

            if (req.files.length == 0 )
                return res.send('Please, send at least one image')
            
            const recipeId = await Recipe.create(recipeValues)

            const recipeFilesPromises = req.files.map((file) =>
                Recipe.createFile({ 
                    name: file.filename,
                    path: `/images/${file.filename}`, 
                    recipe_id: recipeId
                })
            )

            await Promise.all(recipeFilesPromises)

            return res.redirect(`/recipes/${recipeId}`)
        } catch (err) {
            return res.send(`Erro paia ${err}`)
        }

    },
    async edit(req, res) {
        
        let recipe = await Recipe.findOneRecipe(req.params.id)

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

        return res.render("admin/recipes/edit", { recipe, files, chefOption, isAdmin: req.session.isAdmin })

    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send('Please, fill all fields')
                }
            }
            const {
                title,
                chef_id,
                ingredients,
                preparation,
                information,
                id
            } = req.body

            await Recipe.update(id, {
                title,
                chef_id,
                ingredients: `{${ingredients}}`,
                preparation: `{${preparation}}`,
                information
            })
            
            if (req.files.length != 0) {

                if (!req.files.id) {
                    const recipeFilesPromises = req.files.map((file) =>
                        Recipe.createFile({ 
                            name: file.filename,
                            path: `/images/${file.filename}`, 
                            recipe_id: id
                        })
                    )

                    await Promise.all(recipeFilesPromises)
                }

            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const unlinkRemovedFilesPromise = removedFiles.map(async fileId => 
                    fs.unlinkSync(`public${(await File.find(fileId)).path}`)
                )
    
                await Promise.all(unlinkRemovedFilesPromise)

                const deleteRemovedFilesPromise = removedFiles.map(async fileId => 
                    await File.delete(fileId)
                )

                await Promise.all(deleteRemovedFilesPromise)
            }

            

            return res.redirect(`/admin/recipes/${req.body.id}`)

            
        }
        catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
                     
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
            return res.redirect('/error')
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
    
                return res.render("public/search", { recipes: allRecipes, search, isAdmin: req.session.isAdmin })

            } else {
                const recipes = await Recipe.findAllRecipes()
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
    
                return res.render("search", { recipes: allRecipes, search, isAdmin: req.session.isAdmin })


            }

        }
        catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
        const { search } = req.query

        if ( search ) {

            Recipe.findBy(search, function(recipes) {
                return res.render("search", {recipes, search, isAdmin: req.session.isAdmin})
            })

        } else {
            Recipe.findAllRecipes(function(recipes){
                return res.render("search", {recipes, search, isAdmin: req.session.isAdmin})
    
            })
        }
    }
}