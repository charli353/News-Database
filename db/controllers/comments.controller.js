const { insertComment, deleteCommentById } = require('../models/comments.model')

function postCommentWithId(req, res, next) {
    const insert = req.body
    const id = req.params.article_id

    insertComment(insert, id).then((comment) => {

        res.status(201).send(comment)
    })
    .catch(next)
}

function deleteComment(req, res, next) {
    const id = req.params.comment_id
    deleteCommentById(id).then((comment) => {
        res.status(200).send({"deleted_comment" :comment})

})
    .catch(next)
}

module.exports = { postCommentWithId, deleteComment }