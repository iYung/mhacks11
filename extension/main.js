var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');

var user = "ivankhyung@gmail.com";
chrome.storage.local.get('user', function(result) {
  if (result.user) {
    user = result.user;
  };
});

var score = 0;
index.getObject(user, function(err, content) {
  if (content) {
    score = content.score;
  } 
});

var isNewPost = window.location.href.includes("/submit");

var title = "";
var sentence = "";
var flag = false;
var increment = false;

document.addEventListener('click',function(e){
  if(!isNewPost && e.target && e.target.innerHTML == 'save'){
    if (!flag) {
      e.preventDefault();
      checkComment(e);
    } else {
        flag = false
    }
  } else if (isNewPost && e.target && e.target.innerHTML == 'submit') {
    if (!flag) {
      e.preventDefault();
      checkTitle(e);
    } else {
      flag = false;
    }  
  }
})

document.addEventListener('keyup', function(e){
  if (!isNewPost && e.target && e.target.localName == 'textarea') {
    sentence = e.target.value;
  } else if (isNewPost && e.target) {
    if (e.target.getAttribute("name") == "title") {
      title = e.target.value;
    } else if (e.target.getAttribute("name") == "text") {
      sentence = e.target.value;
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

function checkImage(img, e) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0 , 0, img.width, img.height);
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
      var scores = res.outputs[0].data.concepts;
      var safeness = scores.find(obj => {
        return obj.name == "safe"
      });
      if (safeness.value < 0.5) {
        notifyUser(e);
      } else {
        flag = true;
        increment = true;
        navigator.geolocation.getCurrentPosition(updateIndex);
        e.target.click();
      }
    });
}

function checkTitle(e){
  fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCSX9CVGcgKYIHw0uciv5IvAzB2i7iEeZk", {
    method: "POST", 
    body: JSON.stringify({ "document":{ "type":"PLAIN_TEXT", "content": title }, "encodingType": "UTF8" })
  }).then(function(response) {
    return response.json();
  }).then(function(res) {
    if (res.documentSentiment.score < 0) {
      notifyUser(e);
    } else if (res.documentSentiment.score >= 0) {
      var img = document.getElementsByClassName("uploaded-preview-image")[0];
      if (img) {
        checkImage(img, e);
      } else {
        checkComment(e);
      }
    }
  })
}

function notifyUser(e) {
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
}

function checkComment(e){
  fetch("https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCSX9CVGcgKYIHw0uciv5IvAzB2i7iEeZk", {
    method: "POST", 
    body: JSON.stringify({ "document":{ "type":"PLAIN_TEXT", "content": sentence }, "encodingType": "UTF8" })
  }).then(function(response) {
    return response.json();
  }).then(function(res) {
    if (res.documentSentiment.score < 0) {
      notifyUser(e);
    } else if (res.documentSentiment.score >= 0) {
      flag = true;
      increment = true;
      navigator.geolocation.getCurrentPosition(updateIndex);
      e.target.click();
    }
  })
}