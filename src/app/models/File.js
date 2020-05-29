const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async create(data){
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
        const path = data.path.replace(/\\/g, "/" )

        const values = [
            data.name,
            path 
        ]
        
        const results = await db.query(query, values)
        return results.rows[0] 
    },
    async delete(id) {
        try {
            let result = await db.query(`SELECT * FROM files WHERE id = $1`,[id])
            const file = result.rows[0]
            // result = await db.query(`SELECT * FROM recipes_files WHERE file_id = $1`, [id])
            // const recipe_file = result.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])
            
        }catch(err) {
            console.error(err)
        }
        
    }
    
}