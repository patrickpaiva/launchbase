const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const File = require('../models/File')


module.exports = {
    index(req, res) {

        Chef.allChefs(function(chefs){
            return res.render("index", {chefs, isAdmin: req.session.isAdmin})

        })

    },
    about(req, res) {
        return res.render("about", { isAdmin: req.session.isAdmin })
    },
    async showAll(req, res) {
        const chefs = await Chef.allChefs()

        function parseUrl(photo) {
            let avatarUrl =  `${req.protocol}://${req.headers.host}${photo.replace("public", "")}`
            return avatarUrl
        }

        const avatarPromises = chefs.map(async chef => {
            chef.photo = await parseUrl(chef.photo)
            return chef
        })

        const allChefs = await Promise.all(avatarPromises)

        return res.render("chefs", { chefs: allChefs, isAdmin: req.session.isAdmin })
    },
    async show(req, res) {
        const chef = await Chef.find(req.params.id)

        const avatar = `${req.protocol}://${req.headers.host}${chef.photo.replace("public", "")}`

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
        
        return res.render("chef", { chef, avatar, recipes: allRecipes, isAdmin: req.session.isAdmin })
        // Chef.find(req.params.id, function(chef) {

        //     Chef.findChefsRecipes(req.params.id, function(recipes){

        //     })
            
        // })
    },
    async admChefShow(req, res) {
        const chef = await Chef.find(req.params.id)

        const avatar = `${req.protocol}://${req.headers.host}${chef.photo.replace("public", "")}`

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

     
        return res.render("admin/chefs/chef-admpanel", { chef, avatar, recipes: allRecipes, isAdmin: req.session.isAdmin })
    },
    async admChefsList(req, res) {
        const chefs = await Chef.allChefs()
        

        function parseUrl(photo) {
            let avatarUrl =  `${req.protocol}://${req.headers.host}${photo.replace("public", "")}`
            return avatarUrl
        }

        const avatarPromises = chefs.map(async chef => {
            chef.photo = await parseUrl(chef.photo)
            return chef
        })

        const allChefs = await Promise.all(avatarPromises)

        
        return res.render("admin/chefs/adm-panel", { chefs: allChefs, isAdmin: req.session.isAdmin })
        
    },
    create(req, res) {
        return res.render('admin/chefs/create', { isAdmin: req.session.isAdmin })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "" && key != "file_id") {
                return res.send('Please, fill all fields')
            }
        }

        let results = await File.create(req.files[0])

        const file_id = results.id

        const chef = await Chef.create({...req.body, file_id})
        
        return res.redirect(`/admin/chefs/${chef.id}/chefs-admpanel`)
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == "") {
                    return res.send('Please, fill all fields')
                }
            }

            const { id, name } = req.body

            if (req.files.length != 0) {
                //enviar arquivo novo e retornar novo file_id
                let results = await File.create(req.files[0])
                
                const file_id = results.id
                
                await Chef.update(id, {name, file_id})
                //deletar arquivo antigo
                await File.delete(req.body.file_id)
        
                return res.redirect(`/admin/chefs/${req.body.id}/chefs-admpanel`)
            } 

            await Chef.update(id, {name})

            return res.redirect(`/admin/chefs/${req.body.id}/chefs-admpanel`)
        } catch (err) {
            console.error(err)
            return res.send('Internal Error')
        }
    },
    async edit(req, res) {
        const chef = await Chef.find(req.params.id)

        const avatar = `${req.protocol}://${req.headers.host}${chef.photo.replace("public", "")}`

        return res.render('admin/chefs/edit', { chef, avatar, isAdmin: req.session.isAdmin })
    },
    async delete(req, res) {
        try {
            //deleta todas as receitas do chef
            const recipes = await Chef.findChefsRecipes(req.body.id)

            const recipeDeletePromises = recipes.map(async recipe => {
                // deleta os arquivos de cada receita
                let files = await Recipe.files(recipe.id)

                const removingFiles = files.map(file => File.delete(file.file_id))
            
                await Promise.all(removingFiles)

                // deleta cada receita
                await Recipe.delete(recipe.id)
            })
    
            await Promise.all(recipeDeletePromises)

            
            await Chef.delete(req.body.id)
            await File.delete(req.body.file_id)
            return res.redirect('/admin/chefs')
        }
        catch(error) {
            console.error(error)
        }
    },
    async createFile(data){
        const file = await File.create({
            name: data.file.filename,
            path: data.file.path,
        });

        const query = `
            INSERT INTO recipes_files (
                recipe_id,
                file_id
            ) VALUES (
                $1,
                $2
            )
        `;

        return db.query(query, [data.recipe_id, file.id]);
    }
}