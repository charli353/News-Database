const { retrieveUsers } = require(`../models/users.model`)

function getAllUsers(req, res, next) {
    retrieveUsers().then((users) => {
        console.log(users)
        res.status(200).send({ 'users' : users })
    })
}

module.exports = { getAllUsers }