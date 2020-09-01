const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    async allChefs() {
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
        }
    },
    async create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                created_at,
                file_id
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
        const values = [
            data.name,
            date(Date.now()).iso,
            data.file_id
        ]

        const results = await db.query(query, values)

        return results.rows[0]
    },
    async find(id) {
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

    },
    async update(data) {
        try {
            const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3           
            `
            const values = [
                data.name,
                data.file_id,
                data.id
            ]
    
            await db.query(query, values)
        }
        catch(error) {
            console.error(error)
        }
        
    },
    async delete(id) {

        await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    }
}