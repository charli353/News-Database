const db = require('../connection');


const { idCheck, queryCheck } = require('../custom.handler')


         
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

function retrieveArticles(query) {
   
    
    const qArr = []
    const key = Object.keys(query)[0]
    qArr.push(key)
    qArr.push(Object.values(query)[0])

    let baseQuery
    
    //if query is null or undefined (original query)
    if (Object.keys(query).length === 0) {

        return db.query(`SELECT COUNT(c.article_id)::int AS comment_count, a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url FROM articles a, comments c WHERE a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`) 
        .then(({rows}) => {
          
            return rows
        })
    }
    //sort_by sorts by specific column default is date
    else if (qArr[0] === 'sort_by'){

        baseQuery = `SELECT COUNT(c.article_id)::int AS comment_count, a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url FROM articles a, comments c WHERE a.article_id = c.article_id GROUP BY a.article_id ORDER BY $1 DESC;`
        return db.query(baseQuery, [qArr[1]])
            .then(({rows}) => {
      
                return queryCheck(query, rows, key)
            })
    }

    //topic query filters for topics
    else if(qArr[0] === 'topic'){
        
        baseQuery = `SELECT * FROM articles WHERE topic = $1;`
        return db.query(baseQuery, [qArr[1]])
            .then(({rows}) => {
               
                return queryCheck(query, rows, key)
            })
    }
    
    //order sets 

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