const { retrieveTopics } = require('../models/topics.model')
const fs = require('fs/promises')

const endPoints = require('../../endpoints.json')



function getAllTopics(req, res){

    retrieveTopics().then((result) => {
        res.status(200).send(result)
    })
}

function getEndpoints(req, res) {
    res.status(200).send(endPoints)
}


module.exports = { getAllTopics, getEndpoints }