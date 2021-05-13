const { Client } = require('pg');
const { responseJSON } = require('./resJson');
// const pool = new Pool({
//     host: '127.0.0.1',
//     user: 'postgres',
//     password: 'gabriela',
//     database: 'clama',
//     port: 4002
// });
// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     pool.end()
// })
const client = new Client({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'TZ251100',
    database: 'clama',
    port: 5432
})
client.connect()

function checkIfUserExists(identifier, callback) {
    let myQuery
    myQuery = "select * from users where username = $1 and email = $2"
    client.query(myQuery, [identifier.username, identifier.email], (err, res) => {
        if (err) {
            callback(err, null)
            return
        } else {
            callback(null, res);
            return
        }
    })
}

function saveUser(userInfo, res) {
    client.query("insert into users(email, username, password, name, surname, type) values ($1, $2, $3, $4, $5, $6)", [userInfo.email, userInfo.username, userInfo.password, userInfo.name, userInfo.surname, userInfo.type],
        function (err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                responseJSON(res, {
                    error: `email/username already in use`
                })
            } else {
                res.statusCode = 200;
                responseJSON(res, {
                    registered: true,
                    redirect: `http://localhost:8888`
                })
            }
        })
}

module.exports = {
    client,
    checkIfUserExists,
    saveUser
}