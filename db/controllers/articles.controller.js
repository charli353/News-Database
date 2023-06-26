const { retrieveArticlesById } = require('../models/articles.model')
const fs = require('fs/promises')

function getArticleById(req, res, next) {
    const id = req.params.article_id

    retrieveArticlesById(id).then((articles) => {
        res.status(200).send({articles})
   
    })
    .catch(next)


}

module.exports = { getArticleById }