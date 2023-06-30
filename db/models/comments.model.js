const db = require('../connection')
const format = require('pg-format');

function idCheck(id, rows, single) {
    const values = [id]
   if (rows.length === 0) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values).then(({rows}) => {
        return rows
    })
    .then((rows) => {
        if(rows.length !== 0){
            return Promise.reject('Error: 200 - No results')
        }
        else {
           return Promise.reject('Error: 404 - Not Found')
        }
    })
   }
   else if(single === true) {

    return rows[0]
   }
   else return rows
}


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

function deleteCommentById(id) {
    const value = [id]
return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, value)
    .then(({rows}) => {
        return idCheck(id, rows, true)
    })
}

module.exports = { insertComment, deleteCommentById }