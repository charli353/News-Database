const db = require('../connection');

function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, values)
        .then(({rows}) => {
        
            return rows
        })
        
}

module.exports = { retrieveArticlesById }