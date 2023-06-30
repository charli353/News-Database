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
    const validQueries = ['article_id', 'title', 'author', 'created_at', 'votes', 'topic', 'article_img_url']
    

    if (Object.keys(query).length === 1 || Object.keys(query).length === 0){
        if (Object.keys(query).length === 0 || (validQueries.includes(query[key]) === false && key === 'sort_by')) {

            return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(comments.article_id)::int AS comment_count
            FROM articles a
            LEFT JOIN comments ON a.article_id = comments.article_id
            GROUP BY a.article_id ORDER BY a.created_at DESC;`)
            .then(({rows}) => {
              
                return rows
            })
        }
        else if (qArr[0] === 'sort_by' && validQueries.includes(query[key]) === true ){
            return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(comments.article_id)::int AS comment_count
            FROM articles a
            LEFT JOIN comments ON a.article_id = comments.article_id
            GROUP BY a.article_id ORDER BY a.${qArr[1]} DESC;`)
                .then(({rows}) => {
                    return queryCheck(query, rows, key)
                })
        }
    

        else if(qArr[0] === 'topic'){
            
            baseQuery = `SELECT * FROM articles WHERE topic = $1;`
            return db.query(baseQuery, [qArr[1]])
                .then(({rows}) => {
                   
                    return queryCheck(query, rows, key)
                })
        }

    }
    else if (Object.keys(query)[1] === 'order' && Object.keys(query)[0] === 'sort_by'){
        if (query.order !== 'ASC' && query.order !== 'DESC'){
            query.order = 'DESC'
        }
        return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(comments.article_id)::int AS comment_count
        FROM articles a
        LEFT JOIN comments ON a.article_id = comments.article_id
        GROUP BY a.article_id ORDER BY a.${query.sort_by} ${query.order};`)
            .then(({rows}) => {
                return queryCheck(query, rows, key)
            })
    }
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