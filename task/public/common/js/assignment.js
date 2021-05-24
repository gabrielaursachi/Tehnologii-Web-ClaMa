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

async function download(assignmentId) {
    try {
        var url = new URL('http://localhost:8888/api/download')
        var params = { assignmentId: assignmentId }
        url.search = new URLSearchParams(params).toString();
        const res = await fetch(url, {
            method: 'GET'
        })
        const content = await res.body;
        const reader = content.getReader()



        // const stream = new content.Readable() // any Node.js readable stream
        // const blob = await streamToBlob(stream)
        // console.log(blob)
        // console.log(`data retrieved is  ${blob}`)

        // const newBlob = new Blob([blob]);
        // const blobUrl = window.URL.createObjectURL(newBlob);


        // const link = document.createElement('a');
        // link.href = blobUrl;
        // link.setAttribute('download', `file.txt`);
        // // link.setAttribute('download', `${filename}.${extension}`);
        // document.body.appendChild(link);
        // link.click();
        // link.parentNode.removeChild(link);
        // window.URL.revokeObjectURL(blob);

    } catch (error) {
        console.error(error)
    }
}

function readyForDownload(assignmentId) {
    var url = new URL('http://localhost:8888/api/download')
    var params = { assignmentId: assignmentId }
    url.search = new URLSearchParams(params).toString();
    fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => {
            console.log('resp', response);
            console.log(response.text())
            return response;
        }).then(data => {
            //process te file

            // const text = await (new Response(data.blob)).blob();
            // console.log(`bytes of file ${text}`)
            //let encoding = await data.arrayBuffer()

            //let blob = new Blob([encoding], { type: 'text/plain' });
            // downloadFile(blob, "hello.txt")
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.style.display = 'none';
            // a.href = url;
            // // the filename you want
            // a.download = "filename.txt";
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
            // window.URL.revokeObjectURL(url);
            // setTimeout(() => URL.revokeObjectURL(link.href), 7000);
        }).catch(err => console.error(err));
}


const downloadFile = (blob, fileName) => {
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
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

    var parentElement = document.getElementById("assignmentInfo")
    if (assignment.files != null) {
        console.log(`create button`)
        var button = document.createElement('button')
        button.className = "downloadButton"
        button.innerHTML = "Download "
        button.id = "downloadButton"
        var icon = document.createElement('i')
        icon.className = "fa fa-download"
        button.append(icon)
        parentElement.appendChild(button)

        readyForDownload(localStorage.getItem("assignment"))
            // document.getElementById("downloadButton").addEventListener("onclick", )
    }
}


const upload = (file, assignmentId, assignmentText, fileName) => {
    var url = new URL('http://localhost:8888/api/upload')

    var params = { assignmentId: assignmentId, assignmentText: assignmentText, fileName: fileName }
    url.search = new URLSearchParams(params).toString();
    // alert(JSON.stringify(url))
    fetch(url, { // Your POST endpoint
        method: 'POST',
        body: file // This is your file object
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        success => console.log(success) // Handle the success response object
    ).catch(
        error => console.log(error) // Handle the error response object
    );
};

let submitForm = document.getElementById(`assignmentForm`)
let assignmentTextField = document.getElementById(`assignmentText`)
let fileInput = document.getElementById(`fileInput`)
    // console.error(fileInput)
submitForm.onsubmit = async(e) => {
    e.preventDefault();
    console.log(`form submit`)
    let assignmentId = localStorage.getItem(`assignment`)
    upload(fileInput.files[0], assignmentId, assignmentTextField.value, fileInput.value);
}