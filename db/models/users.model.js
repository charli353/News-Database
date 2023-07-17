const db = require('../connection')
const { userCheck } = require('../custom.handler')

function retrieveUsers() {
    return db.query(`SELECT * FROM users;`)
        .then(({rows}) => {
            return rows
        })
}

function findUser(username) {

const values = [username]
return db.query(`SELECT * FROM users WHERE username = $1;`, values)
    .then(({rows}) => {
        return userCheck(username, rows, true)
    })
}

module.exports = { retrieveUsers, findUser }