
const { retrieveArticlesById, retrieveRelevantComments, retrieveArticles, selectArticle, addArticle } = require('../models/articles.model')



function getArticleById(req, res, next) {
    const id = req.params.article_id

    retrieveArticlesById(id).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

function getAllArticles(req, res, next) {
    const query = req.query
    retrieveArticles(query).then((articles) => {

        res.status(200).send({'articles' : articles})
    })
    .catch(next)
}

function getCommentByArticleId(req, res, next) {
    
    const id = req.params.article_id

        retrieveRelevantComments(id).then((comments) => {
            res.status(200).send({'comments': comments})
        })
        .catch(next)
}

function updateArticle(req, res, next) {
    const id = req.params.article_id
    const update = req.body

        selectArticle(id, update).then((article) => {
        res.status(200).send(article)

    })
        .catch(next)
}

function postArticle(req, res, next) {
    const article = req.body

    addArticle(article).then((response) => {
        console.log(response)
        res.status(201).send(response)
    })
    .catch(next)
}

module.exports = { getArticleById, getCommentByArticleId, getAllArticles, updateArticle, postArticle }