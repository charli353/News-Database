const db = require('../connection');

function idCheck(id, rows) {
    const values = [id]
   if (rows.length === 0) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values).then(({rows}) => {
        return rows
    })
    .then((rows) => {
        if(rows.length !== 0){
            return Promise.reject('no comments')
        }
        else {
           return Promise.reject('wrong id')
        }
    })
   }
   else return rows
}
         

      


function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values)
        .then(({rows}) => {
            return idCheck(id, rows)
        
    })
}   

function retrieveRelevantComments(id) {
    const values = [id]
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, values)
        .then(({rows}) => {
            return idCheck(id, rows)
        })
}

function retrieveArticles() {
        return db.query(`SELECT COUNT(c.article_id)::int AS comment_count, a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url FROM articles a, comments c WHERE a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`) 
        .then(({rows}) => {
            return rows
        })
}
module.exports = { retrieveArticlesById, retrieveRelevantComments, retrieveArticles }