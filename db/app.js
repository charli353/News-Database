const express = require('express')
const fs = require('fs/promises')

const { getAllTopics, getEndpoints } = require('../db/controllers/topics.controller')

const app = express()

app.get("/api/topics", getAllTopics)

app.get("/api", getEndpoints)

module.exports = app