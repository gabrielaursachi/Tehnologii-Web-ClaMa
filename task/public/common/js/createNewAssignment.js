let assignmentTitle = document.getElementById(`assignmentName`)
let assignmentDeadlineDate = document.getElementById(`assignmentDeadlineDate`)
let assignmentDeadlineHour = document.getElementById(`assignmentDeadlineHour`)
let assignmentDescription = document.getElementById("assignmentDescription")
let fileInput = document.getElementById(`fileInput`)
let registerForm = document.getElementById(`newAssignment`)
registerForm.onsubmit = async(e) => {
    e.preventDefault();
    upload(fileInput, fileInput.value, assignmentTitle.value, assignmentDescription.value,
        assignmentDeadlineDate.value, assignmentDeadlineHour.value, localStorage.getItem("class"));
}

const upload = (file, fileName, title, description, date, hour, classId) => {
    var url = new URL('http://localhost:8888/api/upload')
    var params = { classId: classId, fileName: fileName, title: title, description: description, deadline_date: date, deadline_hour: hour }
    url.search = new URLSearchParams(params).toString();
    console.log(url);
    fetch(url, { // Your POST endpoint
        method: 'POST',
        body: file
    }).then(
        response => response.json()
    ).then(
        success => console.log(success)
    ).catch(
        error => console.log(error)
    );
};