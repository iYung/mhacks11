var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');

var user = "ivankhyung@gmail.com";
var reddit = "";

chrome.storage.local.get('user', function(result) {
    if (result.user) {
        user = result.user;
        index.getObject(user, function(err, content) {
            if (content) {
            reddit = content.reddit;
            fetch("https://www.reddit.com/user/" + reddit + "/comments.json")
                .then(function(response) {
                    return response.json();
                })
                .then(function(res) { 
                    var comments = res.data.children;
                    comments.forEach(obj => {
                        checkText(obj.data.body, obj.data["link_permalink"]);
                    });
                });
            } 
        });
    };
});

function checkText(text, link){
    fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCSX9CVGcgKYIHw0uciv5IvAzB2i7iEeZk", {
        method: "POST", 
        body: JSON.stringify({ "document":{ "type":"PLAIN_TEXT", "content": text }, "encodingType": "UTF8" })
    }).then(function(response) {
        return response.json();
    }).then(function(res) {
        if (res.documentSentiment.score < 0) {
            var list = document.getElementById("comments");
            var div = document.createElement("a");
            div.innerHTML = text;
            div.setAttribute("href", link);
            div.setAttribute("class", "list-group-item");
            list.appendChild(div);
        } 
    })
  }