const { Client } = require('pg');
const json = require(`./handleJson`);
const bcrypt = require('bcrypt');
const { func } = require('joi');
const jwt = require('jsonwebtoken');
var config = require(`./config`);
const { StatusCodes } = require('http-status-codes');

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
                if (results.rowCount == 0) {
                    res.StatusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, { error: `User with id ${id} not found` })
                }
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

function checkIfClassExists(id, callback) {
    client.query("select * from classes where id = $1", [id], (err, res) => {
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

    client.query("select teach.surname, teach.name, c.title, c.id from users teach join user_classes uc on uc.id_user = teach.id and teach.type='profesor' join classes c on c.id=uc.id_class  where uc.id_class in (select id_class from user_classes uc join users u on u.id=uc.id_user where u.id = $1) order by uc.id_class asc", [id],
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
    client.query("select teach.name, teach.surname, cls.title, cls.no_components, cls.course_site_link, cls.other_platforms, cls.day_of_occurence, cls.start_class, cls.end_class, cls.enter_code from users teach join user_classes c on c.id_user=teach.id and teach.type='profesor'join classes cls on cls.id=c.id_class where c.id_class = $1", [id],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
                return
            } else {
                if (results.rowCount == 0) {
                    res.StatusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, { error: `No class with id ${id} found` })
                    return
                }
                res.statusCode = 200;
                json.responseJSON(res, {
                    teacher: results.rows[0].name + " " + results.rows[0].surname,
                    title: results.rows[0].title,
                    teacher_site: results.rows[0].course_site_link,
                    other_platforms: results.rows[0].other_platforms,
                    schedule: results.rows[0].day_of_occurence + ", " + results.rows[0].start_class + " - " + results.rows[0].end_class,
                    enter_code: results.rows[0].enter_code
                })
            }
        })
}

function checkIfUsernameExists(user, callback) {
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
                }
                res.statusCode = 200;
                json.responseJSON(res, {
                    update: true,
                    message: `updated account succesfully`
                })
                return
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
                }
                res.statusCode = 200;
                json.responseJSON(res, {
                    update: true,
                    message: `updated account succesfully`
                })
            })
    }
}

function checkIfRequestExists(idStudent, idCourse, callback) {
    client.query("select * from classes_requests where id_class = $1 and id_student = $2", [idCourse, idStudent], (err, res) => {
        if (err) {
            callback(err, null)
            return
        } else {
            callback(null, res);
            return
        }
    })
}

function addRequestForClassSignUp(idStudent, idCourse, res) {
    client.query("select * from classes where id = $1", [idCourse],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
                return
            }
            if (results.rowCount == 0) {
                console.log('no class found')
                res.statusCode = 300
                json.responseJSON(res, {
                    error: 'Invalid class code'
                })
                return
            }
            //check if user is in already signed up in the class
            client.query("select * from user_classes where id_user= $1 and id_class = $2", [idStudent, idCourse],
                function(err, results) {
                    if (err) {
                        console.log(err)
                        res.statusCode = 300
                        json.responseJSON(res, {
                            error: err.message
                        })
                        return
                    }
                    console.log(results.rows)
                    if (results.rowCount == 1) {
                        res.statusCode = 300
                        json.responseJSON(res, {
                            error: 'You are already signed up to this class'
                        })
                        return
                    }
                    //save to database
                    client.query("insert into classes_requests(id_class, id_student) values ($1, $2)", [idCourse, idStudent],
                        function(err, results) {
                            if (err) {
                                console.log(err)
                                res.statusCode = 300
                                json.responseJSON(res, {
                                    error: err.message
                                })
                                return
                            }
                            res.statusCode = 200
                            json.responseJSON(res, {
                                message: `Request registered, wait for teacher's approval`
                            })
                        })
                })
            console.log('available class')
        })

}

function getStudentGradesById(idStudent, idCourse, res) {
    console.log(idStudent)
    checkIfClassExists(idCourse, function(err, data) {
        if (err) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: err.message
            })
            console.log(err.message)
            return
        }
        if (data.rowCount == 0) {
            res.StatusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, { error: `Class with id ${idCourse} not found` })
            return
        }
        client.query("select * from classes_catalog where id_class = $1 and id_student = $2", [idCourse, idStudent],
            function(err, results) {
                if (err) {
                    console.log(err);
                    res.statusCode = 300;
                    json.responseJSON(res, {
                        error: err.message
                    })
                    return
                }
                if (results.rowCount == 0) {
                    res.statusCode = 200;
                    json.responseJSON(res, {
                        c1: null,
                        c2: null,
                        c3: null,
                        c4: null,
                        c5: null,
                        bonus: null
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
    })
}

function getClassAssignments(idStudent, idClass, res) {

    checkIfClassExists(idClass, function(err, data) {
        if (err) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: err.message
            })
            console.log(err.message)
            return
        }
        if (data.rowCount == 0) {
            res.StatusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, { error: `Class with id ${idClass} not found` })
            return
        }
        client.query("select id, title, (select concat(name,' ',surname) from users where id=a.id_author) teacher, created_at, deadline, (select count(id_assignment) from students_assignments where (id_assignment, id_student) in (select id_assignment, id_student from students_assignments where id_assignment = a.id and id_student = $2)) status from assignments a where id_class = $1  order by created_at desc", [idClass, idStudent], function(err, results) {
            if (err) {
                res.StatusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, {
                    error: err.message
                })
                return
            }
            for (i = 0; i < results.rowCount; i++) {
                var createdAt = results.rows[i].created_at.toString()
                createdAt = createdAt.substring(4, createdAt.indexOf(" GMT"))
                results.rows[i].created_at = createdAt
                var deadline = results.rows[i].deadline.toString()
                deadline = deadline.substring(4, deadline.indexOf(" GMT"))
                results.rows[i].deadline = deadline
            }
            res.StatusCode = StatusCodes.OK
            json.responseJSON(res, {
                assignments: results.rows
            })
        })
    })


}

function addUserToClass(idUser, idClass, userType, res) {
    client.query("insert into user_classes(id_user, id_class, type) values ($1, $2, $3)", [idUser, idClass, userType],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            }
            if (userType === `student`) {
                res.StatusCodes = StatusCodes.ACCEPTED
                json.responseJSON(res, {
                    message: `added student to your class`
                })
            }
            if (userType === `profesor`) {
                res.StatusCodes = StatusCodes.ACCEPTED
                json.responseJSON(res, {
                    message: `created new class, you can find it in your home page`
                })
            }
        })
}

function createNewClass(idTeacher, classInfo, res) {
    client.query("insert into classes (title, day_of_occurence, start_class, end_class, course_site_link, no_components, formula, other_platforms)  values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [classInfo.className, classInfo.classDate, classInfo.classHourStart, classInfo.classHourEnd, classInfo.classLink, classInfo.classComponents, classInfo.classFormula, classInfo.classOtherPlatforms],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            }
            addUserToClass(idTeacher, results.rows[0].id, `profesor`, res)
        })
}

function getAssignmentInfo(idAssignment, res) {

    client.query("select * from assignments where id = $1", [idAssignment], function(err, results) {
        if (err) {
            console.log(err.message)
            res.StatusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, { error: err.message })
            return
        }
        if (results.rowCount == 0) {
            res.StatusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, { error: `Assignment with id ${idAssignment} not found` })
            return
        }
        client.query("select id_class, (select concat(name,' ',surname) from users where id=a.id_author) author, title, body, created_at, deadline, files from assignments a where id = $1", [idAssignment],
            function(err, results) {
                if (err) {
                    console.log(err.message)
                    res.StatusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, { error: err.message })
                    return
                }
                // console.log(results.rows[0])
                var createdAt = results.rows[0].created_at.toString()
                createdAt = createdAt.substring(4, createdAt.indexOf(" GMT"))
                    // console.log(createdAt)

                var deadline = results.rows[0].deadline.toString()
                deadline = deadline.substring(4, deadline.indexOf(" GMT"))
                    // console.log(deadline)

                res.StatusCode = StatusCodes.OK
                json.responseJSON(res, {
                    idClass: results.rows[0].id_class,
                    teacher: results.rows[0].author,
                    title: results.rows[0].title,
                    body: results.rows[0].body,
                    created_at: createdAt,
                    deadline: deadline,
                    files: results.rows[0].files
                })
            })
    })
}

function getStudentAssignments(idStudent, res) {
    client.query("select id, title, (select concat(name,' ',surname) from users where id=a.id_author) teacher, created_at, deadline, (select count(id_assignment) from students_assignments where (id_assignment, id_student)in (select id_assignment, id_student from students_assignments where id_assignment = a.id and id_student = $1) )status from assignments a join user_classes uc on uc.id_class = a.id_class where uc.id_user = $1  order by created_at desc", [idStudent],
        function(err, results) {
            if (err) {
                res.StatusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, {
                    error: err.message
                })
                return
            }
            for (i = 0; i < results.rowCount; i++) {
                var createdAt = results.rows[i].created_at.toString()
                createdAt = createdAt.substring(4, createdAt.indexOf(" GMT"))
                results.rows[i].created_at = createdAt
                var deadline = results.rows[i].deadline.toString()
                deadline = deadline.substring(4, deadline.indexOf(" GMT"))
                results.rows[i].deadline = deadline
            }
            res.StatusCode = StatusCodes.OK
            json.responseJSON(res, {
                assignments: results.rows
            })
        })
}

function getClassCatalog(idProfesor, idClass, res) {
    console.log('getClassCatalog@database')

    let numberOfComponents
    client.query("select no_components from classes where id = $1", [idClass],
        function(err, result) {
            if (err) {
                console.log(err);
                res.statusCode = 300;
                json.responseJSON(res, {
                    error: err.message
                })
            } else {
                res.statusCode = 200;
                numberOfComponents = result.rows[0].no_components
                console.log(numberOfComponents)
                let numberOfStudents
                client.query("select c.*, u.name, u.surname from classes_catalog c left join users u on u.id = c.id_student where c.id_class = $1", [idClass],
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            res.statusCode = 300;
                            json.responseJSON(res, {
                                error: err.message
                            })
                        } else {
                            res.statusCode = 200;
                            numberOfStudents = result.rowCount
                            console.log(result.rows[0])
                            let students = result.rows
                            json.responseJSON(res, {
                                numberOfComponents: numberOfComponents,
                                numberOfStudents: numberOfStudents,
                                students: students
                            })
                        }
                    })
            }
        })
}

function getClassNews(idClass, res) {
    checkIfClassExists(idClass, function(err, reults) {
        if (err) {
            res.statusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, {
                error: err.message
            })
            console.log(err.message)
            return
        }
        if (reults.rowCount == 0) {
            res.StatusCode = StatusCodes.BAD_REQUEST
            json.responseJSON(res, { error: `Class with id ${idClass} not found` })
            return
        }
        client.query("select * from news where id_class = $1 order by id desc", [idClass],
            function(err, results) {
                if (err) {
                    console.log(err.message)
                    res.StatusCode = StatusCodes.BAD_REQUEST
                    json.responseJSON(res, {
                        error: err.message
                    })
                    return
                }
                res.StatusCode = StatusCodes.OK
                json.responseJSON(res, {
                    news: results.rows
                })
            })
    })
}

function validatePresenceCode(idStudent, code, idClass, res) {
    client.query("select * from classes where enter_code = $1 and id = $2", [code, idClass],
        function(err, results) {
            if (err) {
                console.log(err.message)
                res.StatusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, { error: err.message })
                return
            }
            if (results.rowCount == 0) {
                res.StatusCode = StatusCodes.NOT_FOUND
                json.responseJSON(res, {
                    error: `invalid code`
                })
                return
            }
            //check if it is already present or not for the specific day
            client.query("select id_class, id_user from users_attendance where id_class = $1 and id_user = $2 and present_at::date = (select begin_class::date from classes where id = $1) ", [idClass, idStudent],
                function(err, results) {
                    if (err) {
                        console.log(err.message)
                        res.StatusCode = StatusCodes.BAD_REQUEST
                        json.responseJSON(res, { error: err.message })
                        return
                    }
                    if (results.rowCount == 0) {
                        //check the day  in this query
                        client.query("insert into users_attendance (id_class, id_user, present_at) values ($1, $2, current_timestamp)", [idClass, idStudent],
                            function(err, results) {
                                if (err) {
                                    console.log(err.message)
                                    res.StatusCode = StatusCodes.BAD_REQUEST
                                    json.responseJSON(res, { error: err.message })
                                    return
                                }
                                //check if it is within timestamp
                                client.query("SELECT count(*) FROM users_attendance WHERE present_at >=  (select begin_class  from classes where id = 1) and present_at < (select begin_class + ( interval '5 minute')  from classes where id = $1) and id_user = $2", [idClass, idStudent],
                                    function(err, results) {
                                        if (err) {
                                            console.log(err.message)
                                            res.StatusCode = StatusCodes.BAD_REQUEST
                                            json.responseJSON(res, { error: err.message })
                                            return
                                        }
                                        if (results.rows[0].count == 0) {
                                            res.StatusCode = StatusCodes.OK
                                            json.responseJSON(res, {
                                                message: `late to class`
                                            })
                                            return
                                        } else {
                                            res.StatusCode = StatusCodes.OK
                                            json.responseJSON(res, {
                                                message: `marked as present`
                                            })
                                            markPresence(idStudent, idClass);
                                        }
                                    })
                            })
                    } else {
                        res.StatusCode = StatusCodes.OK
                        json.responseJSON(res, {
                            error: `already entered class presence code`
                        })
                        return
                    }
                })
        })
}

function markPresence(idStudent, idClass) {
    client.query("UPDATE classes_catalog SET presences = (select presences from classes_catalog where id_class = $1 and id_student = $2) + 1 where id_class= $1 and id_student= $2", [idClass, idStudent], function(err, results) {
        if (err) {
            console.log(err.message)
            return
        }
    })
}

function turnInAssignment(idStudent, idAssignment, assignmentBody, fileName, res) {
    client.query("insert into students_assignments(id_assignment, id_student, body, files) values($1, $2, $3, $4)", [idAssignment, idStudent, assignmentBody, fileName],
        function(err, results) {
            if (err) {
                console.log(err);
                res.statusCode = 300
                json.responseJSON(res, {
                    error: err.message
                })
                return
            }
            res.StatusCode = StatusCodes.OK
            json.responseJSON(res, {
                message: `Assignment sent successfully!`
            })
        })
}

function getFileName(id, type, callback) {
    if (type === `assignment`) {
        client.query("select files from assignments where id = $1", [id], (err, res) => {
            if (err) {
                callback(err, null)
                return
            } else {
                callback(null, res);
                return
            }
        })
    }
    if (type === `news`) {
        client.query("select files from news where id = $1", [id], (err, res) => {
            if (err) {
                callback(err, null)
                return
            } else {
                callback(null, res);
                return
            }
        })
    }
}

function changeCode(idClass, newCode, res) {
    client.query("UPDATE classes SET enter_code = $1, begin_class = now()  where id= $2", [newCode, idClass],
        function(err, results) {
            if (err) {
                res.StatusCode = StatusCodes.EXPECTATION_FAILED
                json.responseJSON(res, { error: err.message })
                return
            }
            res.StatusCode = StatusCodes.OK
            json.responseJSON(res, {
                code: newCode
            })
        })
}

function createAssignment(idClass, idAuthor, title, description, deadline, fileName, res) {
    client.query("insert into assignments(id_class, id_author, title, body, created_at, deadline, files) values ($1, $2, $3, $4, now(), $5, $6)", [idClass, idAuthor, title, description, deadline, fileName],
        function(err, results) {
            if (err) {
                console.log(err)
                res.StatusCode = StatusCodes.BAD_REQUEST
                json.responseJSON(res, { error: err.message })
                return
            }
            res.StatusCode = StatusCodes.OK
            json.responseJSON(res, { message: 'Added new assignment successfully' })
        })
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
    getClassAssignments,
    createNewClass,
    getAssignmentInfo,
    getStudentAssignments,
    getClassCatalog,
    getClassNews,
    validatePresenceCode,
    turnInAssignment,
    getFileName,
    changeCode,
    checkIfRequestExists,
    createAssignment
}