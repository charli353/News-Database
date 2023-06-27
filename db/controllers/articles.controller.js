const { error } = require('console')
const { retrieveArticlesById, retrieveArticles } = require('../models/articles.model')


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
        console.log(articles)
        res.status(200).send({'articles' : articles})
    })
}

module.exports = { getArticleById, getAllArticles }