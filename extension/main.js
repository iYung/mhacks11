var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');

var user = "ivankhyung@gmail.com";
chrome.storage.local.get(['user'], function(result) {
  if (result.user) {
    user = result.user;
  };
});

var score = 0;
index.getObject(user, function(err, content) {
  score = content.score;
});

var isReddit = window.location.hostname == "www.reddit.com";
var isNewPost = window.location.href.includes("/submit");

var title = "";
var sentence = "";
var flag = false;
var increment = false;

document.addEventListener('click',function(e){
    if(isReddit && !isNewPost && e.target && e.target.innerHTML == 'save'){
      if (!flag) {
        e.preventDefault();
        var data = {
          "document":{
              "type":"PLAIN_TEXT",
              "content": sentence
          },
          "encodingType": "UTF8"
        };
        fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCSX9CVGcgKYIHw0uciv5IvAzB2i7iEeZk", {
            method: "POST", 
            body: JSON.stringify(data)
        }).then(function(response) {
          return response.json();
        })
        .then(function(res) {
          console.log(res.documentSentiment.score)
          if (res.documentSentiment.score < 0) {
            swal({
              title: 'This post is rude',
              text: "Are you sure you want to say this?",
              imageUrl: 'https://media.tenor.com/images/b307cc45267bd8cc23ea083c53608241/tenor.gif',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: "I don't care"
            }).then((result) => {
              if (result.value) {
                flag = true;
                increment = false;
                navigator.geolocation.getCurrentPosition(updateIndex);
                e.target.click();
              }
            })
          } else if (res.documentSentiment.score >= 0) {
            flag = true;
            increment = true;
            navigator.geolocation.getCurrentPosition(updateIndex);
            e.target.click();
          }
        })
      } else {
        flag = false
      }
    } else if  (isReddit && isNewPost && e.target && e.target.innerHTML == 'submit') {
      var img = document.getElementsByClassName("uploaded-preview-image")[0];
      console.log(img.height);
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0 , 0, img.width, img.height);
      document.getElementsByClassName("roundfield info-notice")[0].appendChild(canvas);
      var pic = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
      var data = {
        "inputs": [
          {
            "data": {
              "image": {
                "base64": pic
              }
            }
          }
        ]
      }
      fetch("https://api.clarifai.com/v2/models/d16f390eb32cad478c7ae150069bd2c6/outputs", {
            method: "POST", 
            headers: new Headers({
              'Authorization': 'Key bc645bdbbc404f009fc4e22726a1e70d', 
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        }).then(function(response) {
          return response.json();
        })
        .then(function(res) {
          console.log(res);
        });
      e.preventDefault();
    }
})

document.addEventListener('keyup', function(e){
    if (isReddit && !isNewPost && e.target && e.target.localName == 'textarea') {
      sentence = e.target.value;
    } else if (isReddit && isNewPost && e.target) {
      if (e.target.getAttribute("name") == "title") {
        title = e.target.value;
        console.log(title);
      } else if (e.target.getAttribute("name") == "text") {
        sentence = e.target.value;
        console.log(sentence);
      }
    };
})

function updateIndex(pos) {
  index.partialUpdateObject({
    score: increment ? ++score : --score,
    _geoloc: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    },
    objectID: user
  }, function(err, content) {
    if (err) throw err;
    console.log(content);
  });
}