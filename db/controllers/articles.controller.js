
const { retrieveArticlesById, retrieveRelevantComments, retrieveArticles, selectArticle } = require('../models/articles.model')



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

// function postArticle(req, res, next) {
//     const article = req.body
//     console.log(article, 'in controller')
//     addArticle(article).then((article) => {
//         req.status(204).send(articles)
//     })
//     .catch(next)
// }

module.exports = { getArticleById, getCommentByArticleId, getAllArticles, updateArticle }