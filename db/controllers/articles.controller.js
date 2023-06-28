
const { retrieveArticlesById, retrieveRelevantComments, retrieveArticles } = require('../models/articles.model')



function getArticleById(req, res, next) {
    const id = req.params.article_id

    retrieveArticlesById(id).then((articles) => {
        let code
            if (Object.keys(articles)[0] === 'Error'){
                next
            }
            else {
                code = 200
            }
        res.status(code).send({articles})
    })
    .catch(next)
}

function getAllArticles(req, res, next) {
    retrieveArticles().then((articles) => {
        res.status(200).send({'articles' : articles})
    })
}

function getCommentByArticleId(req, res, next) {
    
    const id = req.params.article_id

        retrieveRelevantComments(id).then((comments) => {
            let code
            if (Object.keys(comments)[0] === 'Error'){
                next
            }
            else {
                code = 200
            }
            res.status(code).send(comments)
        })
        .catch(next)
}

module.exports = { getArticleById, getCommentByArticleId, getAllArticles }