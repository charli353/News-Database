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

   if (rows.length === 0) {

    return Promise.reject('Error: 200 - No Articles')
    }
        else return rows
}

module.exports = { idCheck, queryCheck }