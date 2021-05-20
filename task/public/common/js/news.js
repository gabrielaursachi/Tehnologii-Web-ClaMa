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
                console.log(`error encountered`);
                console.log(json.error);

            } else {
                fillNewsSection(json)
            }
        })
        .catch(err => { console.log(err) })
}

function fillNewsSection(news) {
    var parentElement = document.getElementById("newPost")
    parentElement.className = "news"
    for (var i = 0; i < news.news.length; i++) {

        var childElement = document.createElement('h1')
        childElement.innerHTML = news.news[i].title

        var body = document.createElement('p')
        body.className = "newsBody"
        body.innerHTML = news.news[i].body

        // childElement.appendChild(body)
        parentElement.appendChild(childElement)
        parentElement.appendChild(body)
    }


}