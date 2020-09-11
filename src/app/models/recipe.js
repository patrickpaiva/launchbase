const db = require('../../config/db')
const File = require('../models/File')

const Base = require('./Base')

Base.init({
  table: 'recipes'
})

module.exports = {
    ...Base,
    async findAllRecipes(){
        try {
            const query = `
            SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name
                    FROM recipes
                    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                    ORDER BY created_at DESC
            `
            
            const recipes = await db.query(query)
            return recipes.rows
            
        } catch (error) {
            console.log(error)
            return res.send('Internal error')
        }
        

    },
    async createFile(data){
        const file_id = await File.create({
            name: data.name,
            path: data.path,
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

        return db.query(query, [data.recipe_id, file_id]);
    },
    async findOneRecipe(id) {
        const query = `
                SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name, files.path as photo
                FROM recipes_files
                FULL JOIN recipes ON (recipes_files.recipe_id = recipes.id)
                LEFT JOIN files ON (recipes_files.file_id = files.id)
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id = $1
            `;

        const results = await db.query(query, [id]);
        return results.rows[0];
    },
    async findBy(search) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${search}%'
            ORDER BY updated_at DESC
        `
        const results = await db.query(query)
        return results.rows
    },
    async chefSelectOptions() {
        const query = `
            SELECT id, name FROM chefs
        `
        const results = await db.query(query)
        return results.rows
        
    },
    async files(id) {
        try {
            const query = `
                SELECT recipes_files.*, files.path, files.id FROM recipes_files
                LEFT JOIN files ON (recipes_files.file_id = files.id)
                WHERE recipes_files.recipe_id = $1
            `
            const results = await db.query(query, [id])
            return results.rows
            
        } catch (error) {
            console.error(error)
            return res.redirect('/error')
        }
    }
}