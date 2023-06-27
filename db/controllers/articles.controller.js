
const { retrieveArticlesById, retrieveRelevantComments } = require('../models/articles.model')


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

function getCommentByArticleId(req, res, next) {
    
    const id = req.params.article_id

        retrieveRelevantComments(id).then((comments) => {
            res.status(200).send(comments)
            console.log(comments)
        })
}

module.exports = { getArticleById, getCommentByArticleId }