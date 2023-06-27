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
module.exports = { retrieveArticlesById }