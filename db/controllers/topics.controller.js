const { retrieveTopics } = require('../models/topics.model')

function getAllTopics(req, res){

    retrieveTopics().then((result) => {
        res.status(200).send(result)
    })
}


module.exports = getAllTopics