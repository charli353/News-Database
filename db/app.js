const express = require('express')
const fs = require('fs/promises')

const getAllTopics = require('../db/controllers/topics.controller')

const app = express()

app.get("/api/topics", getAllTopics)

module.exports = app