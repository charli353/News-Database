
const { retrieveArticlesById, retrieveRelevantComments, retrieveArticles } = require('../models/articles.model')



function getArticleById(req, res, next) {
    const id = req.params.article_id

    retrieveArticlesById(id).then((articles) => {
        res.status(200).send({articles})
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
            res.status(200).send({'comments': comments})
        })
        .catch(next)
}

module.exports = { getArticleById, getCommentByArticleId, getAllArticles }