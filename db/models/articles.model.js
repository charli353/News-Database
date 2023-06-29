const db = require('../connection');

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
   else if (single === true){
    return rows[0]
   }
   else return rows
}
         
function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values)
        .then(({rows}) => {
            return idCheck(id, rows, false)
        
    })
}   

function retrieveRelevantComments(id) {
    const values = [id]
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, values)
        .then(({rows}) => {
            return idCheck(id, rows, false)
        })
}

function retrieveArticles() {
        return db.query(`SELECT COUNT(c.article_id)::int AS comment_count, a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url FROM articles a, comments c WHERE a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`) 
        .then(({rows}) => {
            return rows
        })
}

function selectArticle(id, update) {
    const insert = []
    insert.push(update.inc_votes)
    insert.push(id)
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, insert)
    .then(({rows}) => {
            return idCheck(id, rows, true)
        })
}
module.exports = { retrieveArticlesById, retrieveRelevantComments, retrieveArticles, selectArticle }