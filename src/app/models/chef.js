const db = require('../../config/db')

const Base = require('./Base')

Base.init({
  table: 'chefs'
})

module.exports = {
    ...Base,
    async findAll() {
        try {
            const query = `
                SELECT chefs.*, count(recipes) AS total_recipes, files.path as photo
                FROM chefs
                LEFT JOIN files ON (chefs.file_id = files.id)
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id, files.path
                ORDER BY total_recipes DESC
            `

            const results = await db.query(query)
            return results.rows
            
        }
        catch(error) {
            console.error(error)
            return res.redirect('/error')
        }
    },
    async findOne(id) {
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes, files.path as photo
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id, files.path
        `

        const results = await db.query(query, [id])
        return results.rows[0]

    },
    async findChefsRecipes(id) {
        const query = `
        SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE chef_id = $1
                ORDER BY recipes.id DESC
        `
        
        const recipes = await db.query(query, [id])
        return recipes.rows

    }
}