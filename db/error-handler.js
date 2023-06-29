
function errorHandler(err, req, res, next) {
    if (err.code === '22P02'){
        res.status(400).send({Error: "400, Bad Request"})
    }
    else if (err.code === '22003'){
        res.status(404).send({Error: "404, Invalid ID"})
    }
    else if (err === 'Error: 200 - No results'){
        res.status(200).send({comments: []})
    }
    else if (err.code === '23503'){
        res.status(404).send({Error: 'User does not Exist'})
    }
    else if (err.code === '23502'){
        res.status(400).send({Error : 'Comment requires a text input'})
    }
    else if (err === 'Error: 404 - Not Found'){
        res.status(404).send({ Error: 'ID Does Not Exist' })
    }
    next()
}

module.exports = errorHandler