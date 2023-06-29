const db = require('../connection')
const format = require('pg-format');

function insertComment(insert, id) {
    const insertFormat = Object.values(insert)
    insertFormat.push(id)
  

    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`, insertFormat)
}

module.exports = { insertComment }