fetch('/api/download', {
    method: "GET",
    body: JSON.stringify(classId),
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
            console.log(json.error);
        } else {
            console.log(`registered request`)
        }
    })
    .catch(err => { console.log(err) })