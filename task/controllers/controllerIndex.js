const fs = require('fs')
const { checkIfUsernameExists } = require('../utils/database')
const conn = require('../utils/database')
const schemas = require(`../models/models`)
const { StatusCodes } = require('http-status-codes')
const json = require(`../utils/handleJson`)
const jwt = require('jsonwebtoken');
var config = require(`../utils/config`)

function register(req, res) {
    console.log(`register@controllerIndex`)
    json.requestJSON(req, res, function(recievedJSON) {
        const { error, value } = schemas.accountModel.validate(recievedJSON)
            //value contine email+parola sau username+parola
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        }
        /*
            redirect
            response.writeHead(301,
  {Location: 'http://whateverhostthiswillbe:8675/'+newRoom}
);
            */
        conn.checkIfUserExists(recievedJSON, function(err, data) {
            if (err) {
                res.statusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, {
                    error: err.message
                })
                console.log(err.message)
                return
            } else {
                console.log("result from db is : ", data.rowCount);
                if (data.rowCount == 1) {
                    console.log('Unavailable username')
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        registered: false,
                        error: "Unavailable username"
                    })
                    return
                } else {
                    conn.saveUser(recievedJSON, res)
                }
            }
        });
    })
}

function authenticate(req, res) {
    console.log(`authenticate@controllerIndex`)
    json.requestJSON(req, res, function(recievedJSON) {
        const { error, account } = schemas.authModel.validate(recievedJSON)
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        } else {
            conn.checkAuthData(recievedJSON, res)
        }
    })
}

function identifyUser(req, res) {

    console.log(`identifyUser@ControllerIndex`)
    var token = req.headers['x-access-token'];
    if (!token) {
        res.statusCode = 401
        json.responseJSON(res, { authenticate: false, message: 'No token provided.' })
        return
    }
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            res.statusCode = 500;
            json.responseJSON({
                authenticate: false,
                message: 'Failed to authenticate token.'
            })
        }
        conn.returnUserById(decoded.id, res)
    });

}

function homepage(req, res) {
    // identifyUser(req, res)
    // console.log(req)
    var token = req.headers['x-access-token'];
    console.log(token)
    jwt.verify(token, config.secret, (err, data) => {
        if (err) {
            res.statusCode = 403
            json.responseJSON(res, {
                error: err.message
            })
        } else {
            console.log(data.id)
            conn.findUserById(data.id, function(err, user) {
                if (err) {
                    res.statusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, {
                        error: err.message
                    })
                    console.log(err.message)
                    return
                } else {
                    // conn.findUserClassesByUserId(user.rows[0].id, res);
                    if (user.rows[0].type === `student`) {
                        conn.findUserClassesByUserId(user.rows[0].id, res);
                        // query to select classes of user and return as json to front => interpret there
                        // get request => /api/classes => query to return classes =>
                        // => send to front => front makes another get request to fill html

                    } else {
                        // conn.findUserClassesByUserId(user.rows[0].id, res);
                        res.StatusCode = 200
                        json.responseJSON(res, {
                            redirect: `/teacher/html/profHomePage.html`
                        })
                    }
                }
            })
        }
    })
    console.log(`homepage`)
}

function courseInfo(req, res) {
    conn.findCourseInfoById(1, res)
}

function settingsAccount(req, res) {

    var userID
    jwt.verify(req.headers['x-access-token'], config.secret, (err, data) => {
        if (err) {
            res.statusCode = 403
            json.responseJSON(res, {
                error: err.message
            })
        } else {
            userID = (data.id)
        }
    })

    console.log('@updateAccount')
    json.requestJSON(req, res, function(recievedJSON) {
        const { error, account } = schemas.updateAccountModel.validate(recievedJSON)
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        } else {
            //update checks
            console.log(`@update checking`)
            console.log(recievedJSON)
            conn.checkIfUsernameExists(recievedJSON, function(err, data) {
                if (err) {
                    res.statusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, {
                        error: err.message
                    })
                    console.log(err.message)
                    return
                } else {
                    console.log("result from db is : ", data.rowCount);
                    if (data.rowCount == 1) {
                        if (data.rows[0].id != userID) {
                            console.log('Unavailable username')
                            res.statusCode = 300;
                            json.responseJSON(res, {
                                update: false,
                                error: "Unavailable username"
                            })
                            return
                        }
                    }

                    conn.checkIfEmailExists(recievedJSON, function(err, data) {
                        if (err) {
                            res.statusCode = StatusCodes.BAD_REQUEST
                            json.responseJSON(res, {
                                error: err.message
                            })
                            console.log(err.message)
                            return
                        } else {
                            console.log("result from db is : ", data.rowCount);
                            if (data.rowCount == 1) {
                                if (data.rows[0].id != userID) {
                                    console.log('Unavailable mail')
                                    res.statusCode = 300;
                                    json.responseJSON(res, {
                                        update: false,
                                        error: "Unavailable mail"
                                    })
                                    return
                                }
                            }
                            conn.updateUserInfo(recievedJSON, userID, res)
                        }
                    });
                }
            });

        }
    })
}

module.exports = {
    register,
    authenticate,
    identifyUser,
    homepage,
    courseInfo,
    settingsAccount
}