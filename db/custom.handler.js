const db = require('../db/connection')

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

function queryCheck(query, rows, key) {
  
    const qArr = []
    qArr.push(key)
    qArr.push(Object.values(query)[0])

    const validQueries = ['article_id', 'title', 'author', 'created_at', 'votes', 'topic', 'article_img_url']
    const topics = ['paper', 'cats', 'mitch']
   if (rows.length === 0 || (validQueries.includes(Object.values(query)[0]) === false && query === {})) {
        if(Object.keys(query)[0] === 'topic' && topics.includes(Object.values(query)[0]) === true){
            return Promise.reject('Error: 200 - No Articles')
        }
        else {
            return Promise.reject('Error: 200 - No Topics')
        }
        }
        else return rows
}

module.exports = { idCheck, queryCheck }