const { retrieveUsers } = require(`../models/users.model`)

function getAllUsers(req, res, next) {
    retrieveUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

module.exports = { getAllUsers }