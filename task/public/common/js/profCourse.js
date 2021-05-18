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
                buildUpCourse(json, localStorage.getItem("class"))
            }
        })
        .catch(err => { console.log(err) })
}

function buildUpCourse(classInfo, classId) {

    var enterCodeBox = document.createElement('input')
    enterCodeBox.className = "classCode"
    enterCodeBox.type = "text"
    console.log(classInfo)

    document.getElementById("courseTitle").innerHTML = classInfo.title
    document.getElementById("platforms").innerHTML = classInfo.other_platforms
    document.getElementById("schedule").innerHTML = classInfo.schedule
    document.getElementById("classId").innerHTML = classId
}