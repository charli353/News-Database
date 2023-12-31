const db = require('../connection');


const { idCheck, queryCheck } = require('../custom.handler')


         
function retrieveArticlesById(id) {
    const values = [id]
    return db.query(`SELECT a.article_id, a.title, a.topic, a.body, a.author, a.created_at, a.votes, a.article_img_url, COUNT(comments.article_id)::int AS comment_count
            FROM articles a
            LEFT JOIN comments ON a.article_id = comments.article_id
            WHERE a.article_id = $1
            GROUP BY a.article_id`, values)
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
 
    let baseQuery = `SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(comments.article_id)::int AS comment_count
    FROM articles a
    LEFT JOIN comments ON a.article_id = comments.article_id
    GROUP BY a.article_id`

    if (Object.keys(query).length === 1 || Object.keys(query).length === 0){
        if (Object.keys(query).length === 0) { 
            baseQuery += ` ORDER BY a.created_at DESC;`
            return db.query(baseQuery)
            .then(({rows}) => {
                return queryCheck(query, rows, key)
            })
        }
        else if (qArr[0] === 'sort_by'){
            if(qArr[1] === 'comment_count'){
                baseQuery += ` ORDER BY ${qArr[1]} DESC;`
                return db.query(baseQuery)
                    .then(({rows}) => {
                        return queryCheck(query, rows, key)
                    })
            }
           else {
            baseQuery += ` ORDER BY a.${qArr[1]} DESC;`
            return db.query(baseQuery)
                .then(({rows}) => {
                    return queryCheck(query, rows, key)
                })
           }
            
        }
        else if(qArr[0] === 'topic'){
            return db.query(`SELECT * FROM articles WHERE topic = $1;`, [qArr[1]])
                .then(({rows}) => {
                    return queryCheck(query, rows, key)
                })
        }
    }
    else if (Object.keys(query)[1] === 'order' && Object.keys(query)[0] === 'sort_by'){
        if(qArr[1] === 'comment_count'){
            baseQuery += ` ORDER BY ${query.sort_by} ${query.order};`
        return db.query(baseQuery)
            .then(({rows}) => {
                return queryCheck(query, rows, key)
            })
        }
    else {
        baseQuery += ` ORDER BY a.${query.sort_by} ${query.order};`
        return db.query(baseQuery)
            .then(({rows}) => {
                return queryCheck(query, rows, key)
            })
    }

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

function addArticle(article) {
    const values = Object.values(article)
    console.log(values)
        return db.query(`INSERT INTO articles(title, topic, author, body, article_img_url)
    VALUES($1, $2, $3, $4, $5) RETURNING *;`, values).then(({rows}) => {
        
        return rows[0]
    })
}
module.exports = { retrieveArticlesById, retrieveRelevantComments, retrieveArticles, selectArticle, addArticle }