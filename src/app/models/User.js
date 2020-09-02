const db = require('../../config/db')


module.exports = {
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}
            `
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })


        const results = await db.query(query)
        return results.rows[0]
    },
    async createUser(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin
                ) VALUES ($1, $2, $3, $4)
                RETURNING id
            `

            const values = [
                data.name,
                data.email,
                data.passwordHashed,
                data.isAdmin,
            ]

            return db.query(query, values)
           

        } catch (err) {
            return res.send(`Erro ${err}`)
        }
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        try {
            await db.query('DELETE FROM users WHERE id = $1', [id])
        } catch (err) {
            console.error(err)
        }
    },
    async findAll() {
        try {
            const query = "SELECT * FROM users"

            const results = await db.query(query)
            return results.rows
            
        }
        catch(error) {
            console.error(error)
        }
    },
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