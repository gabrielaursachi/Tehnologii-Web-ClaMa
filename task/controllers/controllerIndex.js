const fs = require('fs')
const { checkIfUsernameExists } = require('../utils/database')
const conn = require('../utils/database')
const schemas = require(`../models/models`)
const { StatusCodes } = require('http-status-codes')
const json = require(`../utils/handleJson`)
const jwt = require('jsonwebtoken');
var config = require(`../utils/config`)
var parseCookies = require(`../utils/cookieParser`)

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
    var request = parseCookies.parseCookies(req) // cookie value is in request.myCookie
    console.log(request.myCookie)
    if (!request.myCookie) {
        res.statusCode = 401
        json.responseJSON(res, { authenticate: false, message: 'No token provided.' })
        return
    }
    jwt.verify(request.myCookie, config.secret, function(err, decoded) {
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
    var token = parseCookies.parseCookies(req);
    console.log(`login token from cookie ${JSON.stringify(token.myCookie)}`)
    jwt.verify(token.myCookie, config.secret, (err, data) => {
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
                    conn.findUserClassesByUserId(user.rows[0].id, res);
                    // if (user.rows[0].type === `student`) {
                    //     conn.findUserClassesByUserId(user.rows[0].id, res);
                    //     // query to select classes of user and return as json to front => interpret there
                    //     // get request => /api/classes => query to return classes =>
                    //     // => send to front => front makes another get request to fill html

                    // } else {
                    //     // conn.findUserClassesByUserId(user.rows[0].id, res);
                    //     // conn.findUserClassesByUserId(user.rows[0].id, res);
                    //     res.StatusCode = 200
                    //     json.responseJSON(res, {
                    //         redirect: `/teacher/html/profHomePage.html`
                    //     })
                    // }
                }
            })
        }
    })
    console.log(`homepage`)
}

function courseInfo(req, res) {
    console.log(req.parameters.class)
    conn.findCourseInfoById(req.parameters.class, res)
}

function getStudentGrades(req, res) {
    console.log(`getStudentGrades@controllerIndex`)
        // console.log(req.parameters.class)
    var request = parseCookies.parseCookies(req)
    if (!request.myCookie) {
        res.statusCode = 401
        json.responseJSON(res, { authenticate: false, message: 'No token provided.' })
        return
    }
    jwt.verify(request.myCookie, config.secret, function(err, decoded) {
        if (err) {
            res.statusCode = 500;
            json.responseJSON({
                authenticate: false,
                message: 'Failed to authenticate token.'
            })
        }
        conn.getStudentGradesById(decoded.id, req.parameters.class, res)
    });
}

function settingsAccount(req, res) {

    var userID
    var request = parseCookies.parseCookies(req)
    jwt.verify(request.myCookie, config.secret, (err, data) => {
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

function logout(req, res) {
    res.statusCode = 200;
    let date = new Date();
    // date.setDate(date.getDate() + 1); //cookie expires in a day
    res.setHeader('Set-cookie', `myCookie=0; HttpOnly; Secure; expires = Mon May 17 2000 19:46:22 GMT; Max-Age=; Domain=localhost; Path=/; overwrite=true`)
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        authenticate: false,
        message: `logged in`,
        redirect: '/',
    }))
    res.end()
}

function enterNewClass(req, res) {
    console.log('enter new class function ')
    json.requestJSON(req, res, function(recievedJSON) {
        console.log(typeof recievedJSON.class)
        if (isNaN(`${recievedJSON.class}` + 1)) {
            console.log("data is not an integer")
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: 'Invalid class code'
            })
            return
        } else {
            //add to database
            var token = parseCookies.parseCookies(req);
            console.log(token.myCookie)
            jwt.verify(token.myCookie, config.secret, (err, decoded) => {
                if (err) {
                    res.statusCode = 403
                    json.responseJSON(res, {
                        error: err.message
                    })
                } else {
                    conn.addRequestForClassSignUp(decoded.id, recievedJSON.class, res)
                }
            })
        }
    })
}

//////////////////////////////////////////////////THIS IS NOT DONE YET
function getClassAssignments(req, res) {

    var request = parseCookies.parseCookies(req) // cookie value is in request.myCookie
    console.log(request.myCookie)
    if (!request.myCookie) {
        res.statusCode = 401
        json.responseJSON(res, { authenticate: false, message: 'No token provided.' })
        return
    }
    jwt.verify(request.myCookie, config.secret, function(err, decoded) {
        if (err) {
            res.statusCode = 500;
            json.responseJSON({
                authenticate: false,
                message: 'Failed to authenticate token.'
            })
        }
        conn.getClassAssignments(decoded.id, req.parameters.class, res)
    });
}


////////////////////////////////formula...........
function createNewClass(req, res) {
    json.requestJSON(req, res, function(recievedJSON) {
        console.log(recievedJSON)
        const { error, newClass } = schemas.classModel.validate(recievedJSON)
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        } else {
            console.log('data is fine')
            console.log(`@create new class`)
            res.StatusCode = 200
            json.responseJSON(res, {
                ok: "ok"
            })
        }
    })
}



module.exports = {
    register,
    authenticate,
    identifyUser,
    homepage,
    courseInfo,
    settingsAccount,
    logout,
    enterNewClass,
    getStudentGrades,
    getClassAssignments,
    createNewClass

}