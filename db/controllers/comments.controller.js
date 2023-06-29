const { insertComment } = require('../models/comments.model')

function postCommentWithId(req, res, next) {
    const insert = req.body
    const id = req.params.article_id

    insertComment(insert, id).then((comment) => {

        res.status(201).send(comment)
    })
    .catch(next)
}

module.exports = { postCommentWithId }