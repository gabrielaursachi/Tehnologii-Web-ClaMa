getClassNews()

function getClassNews() {
    fetch('/api/news?class=' + localStorage.getItem("class"), {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if (json.error) {
                console.log(json.error);
            } else {
                fillNewsSection(json)
            }
        })
        .catch(err => { console.log(err) })
}

async function downloadFile(data) {
    let encoding = await data.arrayBuffer()
    let blob = new Blob([encoding]) //{ type: 'text/plain'}
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = "extra.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setTimeout(() => URL.revokeObjectURL(a.href), 7000);
}

function fetchFile(newsId) {
    var url = new URL('http://localhost:8888/api/download')
    var params = { newsId: newsId }
    url.search = new URLSearchParams(params).toString()
    fetch(url, {
            method: "GET"
        })
        .then((response) => {
            console.log('resp', response);
            return response
        }).then((data) => {
            downloadFile(data)
        }).catch(err => console.error(err));
}

function getnewsid(id) {
    console.log(`news with id ${id}`)
}

function fillNewsSection(news) {
    var parentElement = document.getElementById("newPost")
    parentElement.className = "news"

    let countNewsAttachements = 0
    for (var i = 0; i < news.news.length; i++) {
        var childElement = document.createElement('h1')
        childElement.innerHTML = news.news[i].title
        childElement.id = news.news[i].id
        var body = document.createElement('p')
        body.className = "newsBody"
        body.innerHTML = news.news[i].body
        parentElement.appendChild(childElement)
        parentElement.appendChild(body)

        if (news.news[i].files != null) {
            var button = document.createElement('button')
            button.className = "downloadButton"
            button.innerHTML = "Download "
            button.id = "downloadButton"
            button.number = news.news[i].id
            var icon = document.createElement('i')
            icon.className = "fa fa-download"
            button.append(icon)
            body.appendChild(button)
                // console.log(news.news[i].id)
            button.onclick = getnewsid(news.news[i].id)
        }
    }
}