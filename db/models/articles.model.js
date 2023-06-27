const db = require('../connection');

function idCheck(rows) {
    if(rows.length !== 0){
        return rows
    }
    else return {Error : "ID Does Not Exist"}
}

function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values)
        .then(({rows}) => {
            return idCheck(rows)
        
    })
}   

function retrieveRelevantComments(id) {
    const values = [id]
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, values)
        .then(({rows}) => {
            // console.log(rows)
            return rows
        })
}
module.exports = { retrieveArticlesById, retrieveRelevantComments }