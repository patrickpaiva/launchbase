const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

module.exports = {
    async allRecipes(){

        const query = `
        SELECT recipes.*, chefs.id as chef_id, chefs.name as chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ORDER BY created_at DESC
        `
        
        const recipes = await db.query(query)
        return recipes.rows
        

    },
    formatRecipe(recipe) {
        return {
            ...recipe,
            photo: recipe.photo
                ? recipe.photo.replace('public', '')
                : 'https://place-hold.it/172x80?text=Receita%20sem%20foto',
        };
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO recipes (
                    chef_id,
                    title,
                    ingredients,
                    preparation,
                    information,
                    user_id
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.user_id,
            ]

            return db.query(query, values)
           

        } catch (err) {
            return res.send(`Erro ${err}`)
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
    },
    find(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
        WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    async findOne(id) {
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
        // db.query(`
        // SELECT recipes.*, chefs.name AS chef_name
        // FROM recipes
        // LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        // WHERE recipes.title ILIKE '%${search}%'
        // ORDER BY updated_at ASC`, function(err, results) {
        //     if(err) throw `Database error! ${err}`

        //     callback(results.rows)
        // })
    },
    async update(data) {
        try{
            const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6           
            `
            const values = [
                data.chef_id,
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ]
    
            let results = await db.query(query, values)
            return results.rows[0]
        }
        catch (error) {
            console.error(error)
        }
                
    },
    async chefSelectOptions() {
        const query = `
            SELECT id, name FROM chefs
        `
        const results = await db.query(query)
        return results.rows
        
    },
    async delete(id) {
        const query = `
            DELETE FROM recipes WHERE id = $1
        `
        const results = await db.query(query, [id])
        return results
    },
    async files(id) {
        const query = `
            SELECT recipes_files.*, files.path, files.id FROM recipes_files
            LEFT JOIN files ON (recipes_files.file_id = files.id)
            WHERE recipes_files.recipe_id = $1
        `
        const results = await db.query(query, [id])
        return results.rows
    }
}