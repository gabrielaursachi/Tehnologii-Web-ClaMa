console.log('@buildUpCourse')
    // fetch('http://localhost:8888/api/course', {
    //         method: "GET",
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8"
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(json => {
    //         console.log(json)
    //         if (json.error) {
    //             console.log(`error encountered`);
    //             console.log(json.error);
    //         } else {
    //             console.log(json)
    //         }
    //     })
    //     .catch(err => { console.log(err) })

buildUpCourse()

function buildUpCourse() {

    var enterCodeBox = document.createElement('input')
    enterCodeBox.className = "classCode"
    enterCodeBox.type = "text"

    document.getElementById("teacher").innerHTML = "numele aici"
    document.getElementById("platforms").innerHTML = "platforma aici"
    document.getElementById("schedule").innerHTML = "program aici" + " - mark as present    " //////// lasa spatiu dupa program
    document.getElementById("grades").innerHTML = "notele aici"

    document.getElementById("schedule").appendChild(enterCodeBox)

}


////////////////TO DO: routes to get news and assignments for the specific class