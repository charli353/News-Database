const { retrieveUsers, findUser } = require(`../models/users.model`)

function getAllUsers(req, res, next) {
    retrieveUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

function getUser(req, res, next) {
    const username = req.params.username
  
    findUser(username).then((user) => {
        res.status(200).send({'user' : user})
    })
    .catch(next)
}

module.exports = { getAllUsers, getUser }