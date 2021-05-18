getAccountInfo()

function getAccountInfo() {
    fetch('/api/user', {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                ///////////////////////////
                console.log(`error encountered`);
                console.log(json.error);

            } else {
                fillForm(json)
            }
        })
        .catch(err => { console.log(err) })
}

function fillForm(user) {
    // console.log(user.id)
    document.getElementById(`firstName`).value = user.surname
    document.getElementById(`lastName`).value = user.name
    document.getElementById(`username`).value = user.username
        // document.getElementById(`password`).value = 'password'
    document.getElementById(`email`).value = user.email
}

let updateForm = document.getElementById(`updateForm`)
updateForm.onsubmit = async(e) => {
    e.preventDefault();
    updateUser();
}

function updateUser() {
    console.log(`updateUser happened`)
    let updatedAccount = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
    }
    console.log(updatedAccount)
    fetch('/api/update', {
            method: "POST",
            body: JSON.stringify(updatedAccount),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                /////////////////////////////////////////////TREATEAZA ERORI => email invalid, username.. arata le in pagina utilizatorului
                console.log(`error encountered`);
                console.log(json.error);
            } else {

                console.log(`update done`)
                console.log(json)

            }
        })
        .catch(err => { console.log(err) })
}