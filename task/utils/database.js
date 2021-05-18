const { Client } = require('pg');
const json = require(`./handleJson`);
const bcrypt = require('bcrypt');
const { func } = require('joi');
const jwt = require('jsonwebtoken');
var config = require(`./config`)

const client = new Client({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'gabriela',
    database: 'clama',
    port: 5432
})
client.connect()

function returnUserById(id, res) {
    client.query("select * from users where id = $1", [id],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    authenticate: false,
                    error: err.message
                })
            } else {
                res.statusCode = 200
                json.responseJSON(res, {
                    id: results.rows[0].id,
                    username: results.rows[0].username,
                    name: results.rows[0].name,
                    surname: results.rows[0].surname,
                    email: results.rows[0].email,
                    type: results.rows[0].type
                })
            }
        })
}

function findUserById(id, callback) {
    client.query("select * from users where id = $1", [id], (err, res) => {
        if (err) {
            callback(err, null)
            return
        } else {
            callback(null, res);
            return
        }
    })
}

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
        function(err, results) {
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
        function(err, results) {
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
                        var token = jwt.sign({ id: results.rows[0].id, userType: results.rows[0].type }, config.secret, { expiresIn: 86400 })
                        console.log('@checkAuthData')
                        var redirectTo
                        if (results.rows[0].type === `student`) {
                            redirectTo = `/student/html/homePage.html`
                        } else {
                            redirectTo = `/teacher/html/profHomePage.html`
                        }
                        res.statusCode = 200;
                        let date = new Date();
                        date.setDate(date.getDate() + 1); //cookie expires in a day
                        res.setHeader('Set-cookie', `myCookie=${token}; HttpOnly; Secure; expires =${date}; Max-Age=; Domain=localhost; Path=/; overwrite=true`)
                        res.setHeader('Content-Type', 'application/json');
                        res.write(JSON.stringify({
                            authenticate: true,
                            message: `logged in`,
                            redirect: redirectTo,
                        }))
                        res.end()
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

function findUserClassesByUserId(id, res) {

    client.query("select teach.surname, teach.name, c.title, c.id from users teach join user_classes uc on uc.id_user = teach.id and teach.type='profesor' join classes c on c.id=uc.id_class  where uc.id_class in (select id_class from user_classes uc join users u on u.id=uc.id_user where u.id = $1)", [id],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            } else {
                console.log(results.rows)
                res.statusCode = 200;
                json.responseJSON(res, {
                    classes: results.rows
                })
            }
        })
}

function findCourseInfoById(id, res) {
    console.log(`@findCourseInfoById`)
    client.query("select teach.name, teach.surname, cls.title, cls.no_components, cls.course_site_link, cls.other_platforms, cls.day_of_occurence, cls.start_class, cls.end_class from users teach join user_classes c on c.id_user=teach.id and teach.type='profesor'join classes cls on cls.id=c.id_class where c.id_class = $1", [id],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            } else {
                console.log(results.rows[0].no_components)

                res.statusCode = 200;
                json.responseJSON(res, {
                    teacher: results.rows[0].name + " " + results.rows[0].surname,
                    title: results.rows[0].title,
                    other_platforms: results.rows[0].course_site_link + ", " + results.rows[0].other_platforms,
                    schedule: results.rows[0].day_of_occurence + ", " + results.rows[0].start_class + " - " + results.rows[0].end_class
                })
            }
        })

    ////////TO DO : grades component => another query
}

function checkIfUsernameExists(user, callback) {
    console.log(`@checkIfUsernameExists function`)
    console.log(user)
    client.query("select * from users where username = $1", [user.username], (err, res) => {
        if (err) {
            callback(err, null)
            return
        } else {
            callback(null, res);
            return
        }
    })
}

function checkIfEmailExists(user, callback) {
    client.query("select * from users where email = $1", [user.email], (err, res) => {
        if (err) {
            callback(err, null)
            return
        } else {
            callback(null, res);
            return
        }
    })
}

function updateUserInfo(userInfo, userID, res) {

    if (userInfo.password === '') {
        console.log(`no new password`)
            //         UPDATE table_name
            // SET column1 = value1, column2 = value2...., columnN = valueN
            // WHERE [condition];
        client.query("update users set name = $1 ,  surname = $2 , username = $3 , email = $4 where id = $5", [userInfo.lastName, userInfo.firstName, userInfo.username, userInfo.email, userID],
            function(err, results) {
                if (err) {
                    console.log(err);
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        update: false,
                        error: `update went wrong...`
                    })
                    return
                } else {
                    res.statusCode = 200;
                    json.responseJSON(res, {
                        update: true,
                        message: `updated account succesfully`
                    })
                }
            })
    } else {
        userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        client.query("update users set name = $1 ,  surname = $2 , username = $3 , email = $4, password = $5 where id = $6", [userInfo.lastName, userInfo.firstName, userInfo.username, userInfo.email, userInfo.password, userID],
            function(err, results) {
                if (err) {
                    console.log(err);
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        update: false,
                        error: `update went wrong...`
                    })
                    return
                } else {
                    res.statusCode = 200;
                    json.responseJSON(res, {
                        update: true,
                        message: `updated account succesfully`
                    })
                }
            })
    }
}

function addRequestForClassSignUp(idStudent, idCourse, res) {
    console.log(idStudent)
    client.query("select * from classes where id = $1", [idCourse],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            } else {
                console.log(results.rows)
                if (results.rowCount == 0) {
                    console.log('no class found')
                    res.statusCode = 300
                    json.responseJSON(res, {
                        error: 'Invalid class code'
                    })
                    return
                } else {
                    //check if user is in already signed up in the class
                    client.query("select * from user_classes where id_user= $1 and id_class = $2", [idStudent, idCourse],
                        function(err, results) {
                            if (err) {
                                console.log(err)
                                res.statusCode = 300
                                json.responseJSON(res, {
                                    error: err.message
                                })
                            } else {
                                console.log(results.rows)
                                if (results.rowCount == 1) {
                                    res.statusCode = 300
                                    json.responseJSON(res, {
                                        error: 'You are already signed up to this class'
                                    })
                                } else {
                                    //save to database
                                    client.query("insert into classes_requests(id_class, id_student) values ($1, $2)", [idCourse, idStudent],
                                        function(err, results) {
                                            if (err) {
                                                console.log(err)
                                                res.statusCode = 300
                                                json.responseJSON(res, {
                                                    error: err.message
                                                })
                                            } else {
                                                res.statusCode = 200
                                                json.responseJSON(res, {
                                                    message: `Request registered, wait for teacher's approval`
                                                })
                                            }
                                        })
                                }
                            }
                        })
                    console.log('available class')
                }

            }
        })

}


function getStudentGradesById(idStudent, idCourse, res) {
    console.log('getStudentGradesById@database')
    console.log(idStudent)
    client.query("select * from classes_catalog where id_class = $1 and id_student = $2", [idCourse, idStudent],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            } else {
                res.statusCode = 200;
                json.responseJSON(res, {
                    c1: results.rows[0].c1,
                    c2: results.rows[0].c2,
                    c3: results.rows[0].c3,
                    c4: results.rows[0].c4,
                    c5: results.rows[0].c5,
                    bonus: results.rows[0].bonus
                })
            }
        })
}

///////////////using this to retrieve a course assignments => also need to mark each assignment as done or todo
function getClassAssignments(idStudent, idClass, res) {
    console.log(`this is not done yet`)
}

module.exports = {
    client,
    checkIfUserExists,
    saveUser,
    checkAuthData,
    returnUserById,
    findUserById,
    findUserClassesByUserId,
    findCourseInfoById,
    checkIfUsernameExists,
    checkIfEmailExists,
    updateUserInfo,
    addRequestForClassSignUp,
    getStudentGradesById,
    getClassAssignments
}