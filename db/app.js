const express = require('express')
const fs = require('fs/promises')
const cors = require('cors')


const { getAllTopics, getEndpoints } = require('../db/controllers/topics.controller')
const { getArticleById, getCommentByArticleId, getAllArticles, updateArticle, postArticle } = require('../db/controllers/articles.controller')
const { postCommentWithId, deleteComment } = require('../db/controllers/comments.controller')
const { getAllUsers, getUser } = require('../db/controllers/users.controller')
const errorHandler = require('./error-handler')



const app = express()

app.use(cors());

app.use(express.json())

app.get("/api/topics", getAllTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentByArticleId)

app.post("/api/articles/:article_id/comments", postCommentWithId)

app.get("/api/articles", getAllArticles)

app.patch("/api/articles/:article_id", updateArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getAllUsers)

app.get("/api/users/:username", getUser)

app.post("/api/articles", postArticle)

app.use(errorHandler)




module.exports = app