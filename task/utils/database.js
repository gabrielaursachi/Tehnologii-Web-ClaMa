const { Client } = require('pg');
const json = require(`./handleJson`);
const bcrypt = require('bcrypt');
const { func } = require('joi');

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
    myQuery = "select * from users where username = $1"
    client.query(myQuery, [identifier.username], (err, res) => {
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
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    client.query("insert into users(email, username, password, name, surname, type) values ($1, $2, $3, $4, $5, $6)", [userInfo.email, userInfo.username, userInfo.password, userInfo.name, userInfo.surname, userInfo.type],
        function (err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: `Email already in use`
                })
            } else {
                res.statusCode = 200;
                json.responseJSON(res, {
                    registered: true,
                    redirect: `http://localhost:8888`
                })
            }
        })
}

function checkAuthData(userInfo, res) {
    client.query("select * from users where email = $1 or username = $1", [userInfo.username],
        function (err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    authenticate: false,
                    error: err.message
                })
            } else {
                if (results.rowCount == 1) {
                    if (!bcrypt.compareSync(userInfo.password, results.rows[0].password)) {
                        res.statusCode = 300;
                        json.responseJSON(res, {
                            authenticate: false,
                            error: `Username and password do not match`
                        })
                        return
                    } else {
                        res.statusCode = 200;
                        json.responseJSON(res, {
                            authenticate: true,
                            message: `logged in`,
                            redirect: `home-page`
                        })
                    }
                } else {
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        authenticate: false,
                        error: `Username and password do not match`
                    })
                }
            }
        })
}

module.exports = {
    client,
    checkIfUserExists,
    saveUser,
    checkAuthData
}