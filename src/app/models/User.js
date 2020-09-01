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
}