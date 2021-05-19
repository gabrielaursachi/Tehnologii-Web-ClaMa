const fs = require('fs')
const { checkIfUsernameExists } = require('../utils/database')
const conn = require('../utils/database')
const schemas = require(`../models/models`)
const { StatusCodes } = require('http-status-codes')
const json = require(`../utils/handleJson`)
const jwt = require('jsonwebtoken');
var config = require(`../utils/config`)
var parseCookies = require(`../utils/cookieParser`)
var math = require('mathjs')

function decryptToken(req) {
    var token = parseCookies.parseCookies(req);
    var data;
    try {
        data = jwt.verify(token.myCookie, config.secret)
        console.log(`decoded token: ${JSON.stringify(data)}`)
    } catch (error) {
        console.log(`no token provied. data: ${JSON.stringify(data)}`)
        return undefined
    }
    return data
}

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
    let data = decryptToken(req)
    conn.returnUserById(data.id, res)
}

function homepage(req, res) {
    let data = decryptToken(req);
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

    console.log(`homepage`)
}

function courseInfo(req, res) {
    console.log(req.parameters.class)
    decryptToken(req);
    conn.findCourseInfoById(req.parameters.class, res)
}

function getStudentGrades(req, res) {
    let data = decryptToken(req);
    conn.getStudentGradesById(data.id, req.parameters.class, res)
}

function settingsAccount(req, res) {

    let dataUser = decryptToken(req);
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
                        if (data.rows[0].id != dataUser.id) {
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
                                if (data.rows[0].id != dataUser.id) {
                                    console.log('Unavailable mail')
                                    res.statusCode = 300;
                                    json.responseJSON(res, {
                                        update: false,
                                        error: "Unavailable mail"
                                    })
                                    return
                                }
                            }
                            conn.updateUserInfo(recievedJSON, dataUser.id, res)
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

    dataUser = decryptToken(req)
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
            conn.addRequestForClassSignUp(dataUser.id, recievedJSON.class, res)
        }
    })
}

//////////////////////////////////////////////////THIS IS NOT DONE YET
function getClassAssignments(req, res) {
    dataUser = decryptToken(req)
    conn.getClassAssignments(dataUser.id, req.parameters.class, res)
}


function checkCorecnessOfForumla(formula, components) {
    try {
        components = components - 1 + 1
        switch (components) {
            case 1:
                formula = formula.replace('a', '0')
                math.evaluate(formula)
                return true;
            case 2:
                formula = formula.replace('a', '0')
                formula = formula.replace('b', '0')
                math.evaluate(formula)
                return true;
            case 3:
                formula = formula.replace('a', '0')
                formula = formula.replace('b', '0')
                formula = formula.replace('c', '0')
                math.evaluate(formula)
                return true;
            case 4:
                formula = formula.replace('a', '0')
                formula = formula.replace('b', '0')
                formula = formula.replace('d', '0')
                formula = formula.replace('c', '0')
                math.evaluate(formula)
                return true;
            case 5:
                formula = formula.replace('a', '0')
                formula = formula.replace('b', '0')
                formula = formula.replace('c', '0')
                formula = formula.replace('d', '0')
                formula = formula.replace('e', '0')
                math.evaluate(formula)
                return true;
            default:
                console.log(`default case`)
                return false;
        }
    } catch (error) {

        console.log(`error: ${JSON.stringify(error.message)}`)
        console.log(error)
        return false;
    }
}

function createNewClass(req, res) {
    let auth = decryptToken(req)
    console.log(auth.type)
    if (auth.userType === `student`) {
        res.StatusCode = StatusCodes.UNAUTHORIZED
        json.responseJSON(res, {
            error: `ACCESS UNAUTHORIZED`
        })
    }

    json.requestJSON(req, res, function(recievedJSON) {
        console.log(recievedJSON)
        const { error, newClass } = schemas.classModel.validate(recievedJSON)
        if (error) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: error.message
            })
            return
        }

        let isCorrect = checkCorecnessOfForumla(recievedJSON.classFormula, recievedJSON.classComponents)
        if (!isCorrect) {
            res.StatusCode = StatusCodes.BAD_REQUEST
            return json.responseJSON(res, {
                error: `invalid formula`
            })
        }
        conn.createNewClass(auth.id, recievedJSON, res)
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