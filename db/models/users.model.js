const db = require('../connection')

function retrieveUsers() {
    return db.query(`SELECT * FROM users;`)
        .then(({rows}) => {
            return rows
        })
}

module.exports = { retrieveUsers }