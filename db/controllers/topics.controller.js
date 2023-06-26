const { retrieveTopics } = require('../models/topics.model')

function getAllTopics(req, res){

    retrieveTopics().then((topics) => {
        res.status(200).send({topics})
    })
}


module.exports = getAllTopics