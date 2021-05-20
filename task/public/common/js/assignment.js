//page for specific assignment info + submit
assignmentInfo()

function assignmentInfo() {
    fetch('/api/assignment?id=' + localStorage.getItem("assignment"), {
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
                console.log(json)
                fillAssignmentInfo(json)
            }
        })
        .catch(err => { console.log(err) })
}

function fillAssignmentInfo(assignment) {

    var header = document.getElementById('assignmentTitle')
    header.innerHTML = assignment.title

    var author = document.getElementById('teacher')
    author.innerHTML = assignment.teacher

    var postedAt = document.getElementById('postedAt')
    postedAt.innerHTML = assignment.created_at

    var deadline = document.getElementById('deadline')
    deadline.innerHTML = assignment.deadline

    var extra = document.getElementById('assignmentBody')
    extra.innerHTML = assignment.body
}

submitAssignment()

function submitAssignment() {
    console.log(`for submitting`)
}