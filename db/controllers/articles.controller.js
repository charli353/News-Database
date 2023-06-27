const { error } = require('console')
const { retrieveArticlesById } = require('../models/articles.model')
const fs = require('fs/promises')

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

module.exports = { getArticleById }