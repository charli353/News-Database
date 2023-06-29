const express = require('express')
const fs = require('fs/promises')

const { getAllTopics, getEndpoints } = require('../db/controllers/topics.controller')
const { getArticleById, getCommentByArticleId, getAllArticles } = require('../db/controllers/articles.controller')
const { postCommentWithId } = require('../db/controllers/comments.controller')


const app = express()

app.use(express.json())

app.get("/api/topics", getAllTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentByArticleId)

app.post("/api/articles/:article_id/comments", postCommentWithId)

app.get("/api/articles", getAllArticles)


app.use((err, req, res, next) => {

    if (err.code === '22P02'){
        res.status(400).send({Error: "400, Bad Request"})
    }
    else if (err.code === '22003'){
        res.status(400).send({Error: "400, Invalid ID"})
    }
    else if (err === 'no comments'){
        res.status(200).send({comments: []})
    }
    else if (err.code === '23503'){
        res.status(400).send({Error: 'User does not Exist'})
    }
    else if (err.code === '23502'){
        res.status(400).send({Error : 'Collumn requires Not Null value'})
    }
    else if (err === 'wrong id'){
        res.status(404).send({ Error: 'ID Does Not Exist' })
    }
    next()
})

module.exports = app