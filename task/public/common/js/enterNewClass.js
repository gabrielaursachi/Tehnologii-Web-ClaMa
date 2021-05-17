document.querySelector('input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        console.log(document.getElementById("enterNewClass").value)

        let classId = {
            class: document.getElementById("enterNewClass").value
        }

        //redirect to register to new class on enter
        fetch('/api/enter-new-class', {
                method: "POST",
                body: JSON.stringify(classId),
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
                    console.log(`registered request`)
                    console.log(json)
                }
            })
            .catch(err => { console.log(err) })
        document.getElementById("enterNewClass").value = ""
    }
});