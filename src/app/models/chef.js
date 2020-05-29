const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    allChefs(callback) {
        
        db.query(` SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`, function(err, results) {
            if(err) throw `Database error! ${err}`

            callback(results.rows)
        })

    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                avatar_url,
                name,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `
        const values = [
            data.avatar_url,
            data.name,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback(results.rows[0])
        })
    },
    async find(id) {
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
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
    update(data, callback) {
        const query = `
        UPDATE chefs SET
            avatar_url=($1),
            name=($2)
        WHERE id = $3           
        `
        const values = [
            data.avatar_url,
            data.name,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database error! ${err}`

            return callback()
        })
    }
}