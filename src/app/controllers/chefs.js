const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const { date } = require('../../lib/utils')
const File = require('../models/File')


module.exports = {
    index(req, res) {

        Chef.allChefs(function(chefs){
            return res.render("index", {chefs})

        })

    },
    about(req, res) {
        return res.render("about")
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

        return res.render("chefs", { chefs: allChefs })
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
        
        return res.render("chef", { chef, avatar, recipes: allRecipes })
        // Chef.find(req.params.id, function(chef) {

        //     Chef.findChefsRecipes(req.params.id, function(recipes){

        //     })
            
        // })
    },
    async admchef(req, res) {
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
        
        return res.render("admin/chefs/chef-admpanel", { chef, avatar, recipes: allRecipes })
    },
    async admpanel(req, res) {
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

        return res.render("admin/chefs/adm-panel", { chefs: allChefs })
        
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

        let results = await File.create(req.files[0])

        const file_id = results.id

        const chef = await Chef.create({...req.body, file_id})
        
        return res.redirect(`/admin/chefs/${chef.id}/chefs-admpanel`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

        //deletar arquivo antigo
        await File.delete(req.body.file_id)
        

        //enviar arquivo novo e retornar novo file_id
        let results = await File.create(req.files[0])

        const file_id = results.id

             
        await Chef.update({...req.body, file_id})

        return res.redirect(`/admin/chefs/${req.body.id}/chefs-admpanel`)
    },
    async edit(req, res) {
        const chef = await Chef.find(req.params.id)

        const avatar = `${req.protocol}://${req.headers.host}${chef.photo.replace("public", "")}`

        return res.render('admin/chefs/edit', { chef, avatar })
    },
    async delete(req, res) {
        try {
            await File.delete(req.body.file_id)
            await Chef.delete(req.body.id)
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