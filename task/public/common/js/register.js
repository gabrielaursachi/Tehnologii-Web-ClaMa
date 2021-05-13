let registerForm = document.getElementById(`userForm`)
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    registerUser();
}

function registerUser() {

    let account = ''
    if (document.getElementById("student").checked) {
        account = "student"
    } else {
        account = "profesor"
    }
    let values = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        type: account
    }
    console.log(values)
    fetch('/api/register', {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                ///////////////////////////
                console.log(`error encountered`);
                console.log(json.error);

                var invalidDataError = document.getElementById('invalidData')
                invalidDataError.className += " display"
                document.getElementById("invalidData").innerHTML = json.error.split('.')[0]

                // if (json.error === "unavailable username") {
                //     console.log("username error ")
                //     try {
                //         alert("unavailable usernme");
                //     } catch (err) {
                //         document.getElementById("username").innerHTML = err.message;
                //     }
                // } else {
                //     try {
                //         alert("unavailable email");
                //     } catch (err) {
                //         document.getElementById("email").innerHTML = err.message;
                //     }
                // }

            } else {
                location.href = `http://localhost:8888`
            }
        })
        .catch(err => { console.log(err) })
}