const data = require("../data.json")
const fs = require('fs')

exports.index = function (req, res) {
    return res.render("index", {recipes: data.recipes})
}

exports.about = function(req, res){
    return res.render("sobre")
}

exports.showAll = function(req, res){
    return res.render("receitas", {recipes: data.recipes})
}

exports.show = function (req, res) {
    const recipeIndex = req.params.id;
    return res.render("recipe", { item: data.recipes[recipeIndex]})
}

exports.create = function (req, res) {
    return res.render('admin/recipes/create')
}

exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields')
        }
    }

    data.recipes.push({
        ...req.body,
    })

    const idRecipe = data.recipes.length-1

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write file error!')

        return res.redirect(`../recipes/${idRecipe}`)

    })
}

exports.put = function(req, res) {
    const recipeIndex = req.params.id
    const foundRecipe = data.recipes[recipeIndex]

    if (!foundRecipe) return res.send('recipe not found')

    const recipe = {
        ...foundRecipe,
        ...req.body
    }

    
    data.recipes[recipeIndex] = recipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return('Writing file error!')

        return res.redirect(`/recipes/${recipeIndex}`)
    })


}

exports.edit = function(req, res) {
    const recipeIndex = req.params.id
    const foundRecipe = data.recipes[recipeIndex]

    if (!foundRecipe) return res.send('recipe not found')

    const recipe = {
        id: recipeIndex,
        ...foundRecipe,
    }
    



    return res.render('admin/recipes/edit', { recipe })

}

exports.delete = function(req, res) {
    const recipeIndex  = req.params.id

    function removeRecipe () {
        data.recipes.splice(recipeIndex, 1)
    }

    removeRecipe();

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return('Writing file error!')

        return res.redirect(`/receitas`)
    })}