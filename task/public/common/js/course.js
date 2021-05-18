retrieveCourseData()

function retrieveCourseData() {

    console.log(localStorage.getItem("class"))
    fetch('/api/course?class=' + localStorage.getItem("class"), {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                console.log(`error encountered`);
                console.log(json.error);
            } else {
                retrieveStudentGrades(json)
            }
        })
        .catch(err => { console.log(err) })
}


function retrieveStudentGrades(classInfo) {
    console.log(localStorage.getItem("class"))
    fetch('/api/grades?class=' + localStorage.getItem("class"), {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                console.log(`error encountered`);
                console.log(json.error);
            } else {
                buildUpCourse(classInfo, json)
            }
        })
        .catch(err => { console.log(err) })
}

function buildUpCourse(classInfo, studentGrades) {

    var enterCodeBox = document.createElement('input')
    enterCodeBox.className = "classCode"
    enterCodeBox.type = "text"

    document.getElementById("courseTitle").innerHTML = classInfo.title

    document.getElementById("teacher").innerHTML = classInfo.teacher
    document.getElementById("platforms").innerHTML = classInfo.other_platforms
    document.getElementById("schedule").innerHTML = classInfo.schedule + "  -  mark as present "

    let grades = ""

    if (studentGrades.c1 != null) {
        grades += studentGrades.c1
    }
    if (studentGrades.c2 != null) {
        grades += ', '
        grades += studentGrades.c2
    }
    if (studentGrades.c3 != null) {
        grades += ', '
        grades += studentGrades.c3
    }
    if (studentGrades.c4 != null) {
        grades += ', '
        grades += studentGrades.c3
    }
    if (studentGrades.c5 != null) {
        grades += ', '
        grades += studentGrades.c3
    }
    if (studentGrades.bonus != null) {
        grades += ', '
        grades += studentGrades.bonus
        grades += '(bonus)'
    }
    document.getElementById("grades").innerHTML = grades
    document.getElementById("schedule").appendChild(enterCodeBox)
}

retrieveAssignmentsData()

function retrieveAssignmentsData() {
    fetch('/api/assignments?class=' + localStorage.getItem("class"), {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                console.log(`error encountered`);
                console.log(json.error);
            } else {
                buildUpCourse(classInfo, json)
            }
        })
        .catch(err => { console.log(err) })

}

////////////////TO DO: routes to get news and assignments for the specific class