getAssignments()

function getAssignments() {
    fetch('/api/all-assignments', {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                if (json.error == "no auth") {
                    location.href = "https://webclassmanager.herokuapp.com/"
                }
                console.log(`error encountered`);
                console.log(json.error);
            } else {
                showAllAssignments(json)
            }
        })
        .catch(err => { console.log(err) })
}

function showAllAssignments(assignments) {

    console.log(`showallasignments from here`)

    var parentElement = document.getElementById("myAssignments")
    parentElement.className = "assignments"
    for (var i = 0; i < assignments.assignments.length; i++) {

        if (assignments.assignments[i].status != 0) {
            let assignmentTitle = document.createElement('div')
            assignmentTitle.className = "assignmentTitleDone"

            var childElement = document.createElement('a')
            childElement.className = "assignment_container"
            childElement.href = "https://webclassmanager.herokuapp.com/student/html/assignment.html"
            childElement.assignmentID = assignments.assignments[i].id

            let assignmentName = document.createElement('p')
            assignmentName.className = "assignmentName"
            let titleContent = document.createElement('b')
            titleContent.innerHTML = assignments.assignments[i].title

            assignmentName.appendChild(titleContent)
            assignmentTitle.appendChild(assignmentName)
            let assignmentInfoBody = document.createElement('div')
            assignmentInfoBody.className = "assignmentInfoDone"


            let author = document.createElement('p')
            author.innerHTML = `Author : ` + assignments.assignments[i].teacher
            author.id = "author"
            let postedAt = document.createElement('p')
            postedAt.innerHTML = `Posted at : ` + assignments.assignments[i].created_at
            postedAt.id = "postedAt"
            let deadline = document.createElement('p')
            deadline.innerHTML = `Deadline: ` + assignments.assignments[i].deadline
            deadline.id = "deadline"

            assignmentInfoBody.appendChild(author)
            assignmentInfoBody.appendChild(postedAt)
            assignmentInfoBody.appendChild(deadline)

            childElement.appendChild(assignmentTitle)
            childElement.appendChild(assignmentInfoBody)

            parentElement.appendChild(childElement)

        }
    }

    var myAssignments = document.getElementById('myAssignments')
    for (i = 0; i < myAssignments.childNodes.length; i++) {
        let assignmentID = myAssignments.childNodes[i].assignmentID
        myAssignments.childNodes[i].onclick = function () {
            console.log(`clicked assignment with id ` + assignmentID)
            localStorage.setItem("assignment", assignmentID)
        }
    }

}