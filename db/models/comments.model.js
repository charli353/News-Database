const db = require('../connection')
const format = require('pg-format');

function insertComment(insert, id) {
    const insertFormat = []
        insertFormat.push(insert.username)
        insertFormat.push(insert.body)
        insertFormat.push(id)

    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`, insertFormat)
        .then(({rows}) => {
        
            return rows[0]
        })
}

module.exports = { insertComment }