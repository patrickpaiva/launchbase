const Recipe = require('../models/Recipe')

async function getImage(recipeId) {
    let files = await Recipe.files(recipeId)

    files = files.map(file => `${file.path}`)

    return files[0]
}
const LoadService = {
    load(service) {
        return this[service]()
    },
    async recipes() {
        const recipes = await Recipe.findAllRecipes()
        
        const recipeFilesPromises = recipes.map(async recipe => {
            recipe.photo = await getImage(recipe.id)
            return recipe
        })
    
        return Promise.all(recipeFilesPromises)
    }
}

module.exports = LoadService

