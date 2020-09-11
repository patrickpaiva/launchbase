const db = require('../../config/db')

const Base = require('./Base')

Base.init({
    table: 'users'
  })
  
  module.exports = {
      ...Base,
    async findUsersRecipes(id) {
        const query = `
        SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE user_id = $1
                ORDER BY recipes.id DESC
        `
        
        const recipes = await db.query(query, [id])
        return recipes.rows
    }
}