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
    find(id, callback) {
        db.query(`SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], function(err, results){
            if(err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    findChefsRecipes(id, callback) {
        db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`

            callback(results.rows)
        })
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