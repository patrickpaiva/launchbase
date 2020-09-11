const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')


module.exports = {
    async showAll(req, res) {
        const chefs = await Chef.findAll()

        function parseUrl(photo) {
            let avatarUrl =  `${req.protocol}://${req.headers.host}${photo.replace("public", "")}`
            return avatarUrl
        }

        const avatarPromises = chefs.map(async chef => {
            chef.photo = await parseUrl(chef.photo)
            return chef
        })

        const allChefs = await Promise.all(avatarPromises)

        return res.render("public/chefs", { chefs: allChefs, session: req.session })
    },
    async show(req, res) {
        try {
            const chef = await Chef.findOne(req.params.id)
    
            if (!chef) {
                return res.redirect('/not-found')
            }
    
            let recipes = await Chef.findChefsRecipes(req.params.id)
    
            async function getImage(recipeId) {
                let files = await Recipe.files(recipeId)
    
                files = files.map(file => `${file.path}`)
    
                return files[0]
            }
    
            const recipeFilesPromises = recipes.map(async recipe => {
                recipe.photo = await getImage(recipe.id)
                return recipe
            })
    
            recipes = await Promise.all(recipeFilesPromises)
            
            return res.render("public/chef", { chef, recipes, isAdmin: req.session.isAdmin })
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async admChefShow(req, res) {
        const chef = await Chef.findOne(req.params.id)

        if (!chef) {
            return res.redirect('/not-found')
        }

        let recipes = await Chef.findChefsRecipes(req.params.id)

        async function getImage(recipeId) {
            let files = await Recipe.files(recipeId)

            files = files.map(file => `${file.path}`)

            return files[0]
        }

        const recipeFilesPromises = recipes.map(async recipe => {
            recipe.photo = await getImage(recipe.id)
            return recipe
        })

        recipes = await Promise.all(recipeFilesPromises)

     
        return res.render("admin/chefs/show", { chef, recipes, isAdmin: req.session.isAdmin })
    },
    async admChefsList(req, res) {
        try {
            const chefs = await Chef.findAll()
            
            return res.render("admin/chefs/chefs", { chefs, isAdmin: req.session.isAdmin })
            
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
        
    },
    create(req, res) {
        return res.render('admin/chefs/create', { isAdmin: req.session.isAdmin })
    },
    async post(req, res) {
        try {
            const file = req.files[0]

            const file_id = await File.create({
                name: file.filename,
                path: `/images/${file.filename}`
            })

            const chefId = await Chef.create({...req.body, file_id})
        
            return res.redirect(`/admin/chefs/${chefId}`) 


        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async edit(req, res) {
        try {
            const chef = await Chef.findOne(req.params.id)

            if(!chef) {
                return res.redirect('/not-found')
            }
    
            const avatar = `${chef.photo}`
    
            return res.render('admin/chefs/edit', { chef, avatar, isAdmin: req.session.isAdmin })
            
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async put(req, res) {
        try {
            const { id, name } = req.body

            if (req.files.length != 0) {
                const file = req.files[0]

                const file_id = await File.create({
                    name: file.filename,
                    path: `/images/${file.filename}`
                })
                
                await Chef.update(id, {name, file_id})

                await File.delete(req.body.file_id)
        
                return res.redirect(`/admin/chefs/${req.body.id}`)
            } 

            await Chef.update(id, {name})

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (err) {
            console.error(err)
            return res.redirect('/error')
        }
    },
    async delete(req, res) {
        try {
            const recipes = await Chef.findChefsRecipes(req.body.id)

            const recipeDeletePromises = recipes.map(async recipe => {

                let files = await Recipe.files(recipe.id)

                const removingFiles = files.map(file => File.delete(file.file_id))
            
                await Promise.all(removingFiles)

                await Recipe.delete(recipe.id)
            })
    
            await Promise.all(recipeDeletePromises)
            
            await Chef.delete(req.body.id)

            await File.delete(req.body.file_id)
            
            return res.redirect('/admin/chefs')
        }
        catch(error) {
            console.error(error)
            return res.redirect('/error')
        }
    }
}