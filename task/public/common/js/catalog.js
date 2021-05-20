retrieveCourseCatalog()

console.log('merge')

function retrieveCourseCatalog() {
    console.log(localStorage.getItem("class"))
    fetch('/api/catalog?class=' + localStorage.getItem("class"), {
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
                console.log('students data')
                console.log(json)
                buildCatalog(json)
            }
        })
        .catch(err => { console.log(err) })
}

function buildCatalog(res) {
    console.log(res.numberOfComponents)

    var catalog = document.getElementById("catalog")

    var tr = document.createElement('tr')
    var th1 = document.createElement('th')
    th1.innerHTML = "Name"
    var th2 = document.createElement('th')
    th2.innerHTML = "Presences"
    tr.appendChild(th1)
    tr.appendChild(th2)

    for (let i = 1; i <= res.numberOfComponents; i++) {
        var th = document.createElement('th')
        th.innerHTML = "C" + i
        th.className = "c" + i
        tr.appendChild(th)
    }

    var th3 = document.createElement('th')
    th3.innerHTML = "Bonus"
    var th4 = document.createElement('th')
    th4.innerHTML = "Final Grade"
    tr.appendChild(th3)
    tr.appendChild(th4)

    catalog.appendChild(tr)

    for (let i = 0; i < res.numberOfStudents; i++) {
        var tr = document.createElement('tr')
        var th1 = document.createElement('td')
        th1.innerHTML = res.students[i].surname + " " + res.students[i].name
        var th2 = document.createElement('td')
        th2.innerHTML = res.students[i].presences
        tr.appendChild(th1)
        tr.appendChild(th2)

        for (let j = 1; j <= res.numberOfComponents; j++) {
            var th = document.createElement('td')
            if (j == 1)
                th.innerHTML = res.students[i].c1
            if (j == 2)
                th.innerHTML = res.students[i].c2
            if (j == 3)
                th.innerHTML = res.students[i].c3
            if (j == 4)
                th.innerHTML = res.students[i].c4
            if (j == 5)
                th.innerHTML = res.students[i].c5

            th.className = "id" + res.students[i].id_student + "c" + i
            tr.appendChild(th)
        }

        var th3 = document.createElement('td')
        th3.innerHTML = res.students[i].bonus
        var th4 = document.createElement('td')
        th4.innerHTML = (res.students[i].c1 + res.students[i].c2 + res.students[i].c3) / 3 + res.students[i].bonus
        tr.appendChild(th3)
        tr.appendChild(th4)

        catalog.appendChild(tr)
    }

}