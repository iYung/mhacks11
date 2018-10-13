var sentence = "";
var flag = false;

document.addEventListener('click',function(e){
    if(e.target && e.target.innerHTML == 'save'){
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
          if (res.documentSentiment.score < 0 && confirm("This is rude! Are you sure you want to post this?")) {
            flag = true;
            e.target.click();
          } else if (res.documentSentiment.score >= 0) {
            flag = true;
            e.target.click();
          }
        })
      } else {
        flag = false
      }
    }
})

document.addEventListener('keyup', function(e){
    if (e.target && e.target.localName == 'textarea') {
        sentence = e.target.value;
    };
})