const db = require('../connection');

function idCheck(rows) {
    if(rows.length !== 0){
        return rows
    }
    else return {Error : "ID Does Not Exist"}
}

function countComments(articleId) {

}

function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values)
        .then(({rows}) => {
            return idCheck(rows)
        
    })
}   

function retrieveArticles() {
        const baseQuery = `SELECT articles.article_id, title, topic, author, created_at, votes, article_img_url, comment_count FROM articles LEFT JOIN comment_to_id ON comment_to_id.article_id = articles.article_id ORDER BY created_at DESC;`
        return db.query(baseQuery)
        .then(({rows}) => {
            return rows
        })
}
module.exports = { retrieveArticlesById, retrieveArticles }