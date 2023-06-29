const { insertComment } = require('../models/comments.model')

function postCommentWithId(req, res, next) {
    const insert = req.body
    const id = req.params.article_id

    insertComment(insert, id).then(({rows}) => {

        res.status(201).send(rows[0])
    })
    .catch(next)
}

module.exports = { postCommentWithId }