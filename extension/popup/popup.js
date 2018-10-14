// aloglia set up 
var client = algoliasearch('WWH064LBS0', '0fb85dc186ad906ed95a01f12cceecfc');
var index = client.initIndex('users');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBo-J3s2LcCqzSCRxkkEzkKaoLEihQlAwU",
  authDomain: "mhacks11-c8e81.firebaseapp.com",
  databaseURL: "https://mhacks11-c8e81.firebaseio.com",
  projectId: "mhacks11-c8e81",
  storageBucket: "mhacks11-c8e81.appspot.com",
  messagingSenderId: "354599152461"
};
firebase.initializeApp(config);

//declare function for getting from algolia
var reddit ="Hi";
var user = ""; //default user 
var Score = 0;

function updateIndex() {
  index.partialUpdateObject({
    reddit: reddit,
    objectID: user
  }, function(err, content) {
    if (err) throw err;
  });
}

// get elements 
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById("btnSignUp");

//login authentication 
//wrapped around even listener to ensure page loads first 
document.addEventListener('DOMContentLoaded', function(){
if (btnLogin){
  console.log("1");
    btnLogin.addEventListener('click' , e => {
      //check for real email 
      const email = txtEmail.value;
      const pass = txtPassword.value;
      const auth = firebase.auth();
      //sign in 
      console.log(email);
      const promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));

      // Save it using the Chrome extension storage API.
      chrome.storage.local.set({'user': email}, function() 
      {
        // Notify that we saved.
        console.log('Settings saved');
      });
      });
    }
  });
//sign up authentication 
  document.addEventListener('DOMContentLoaded', function(){ 
   if (btnSignUp){
  btnSignUp.addEventListener('click' , e => {
    //check for real email 
    console.log("clicked Signup");
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
   
    //sign up
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
    promise 
      .then(user => console.log(user))
      .catch(e => console.log(e.message));

      console.log(email);

      chrome.storage.local.set({'user': email}, function() 
      {
        // Notify that we saved.
        console.log('Settings saved');
      });
      index.addObject(
        {score:0,
        objectID: email}, function(err, content) {
        console.log(content);})
    });
  }
});
    
    //realtime authenticaiton listener
 document.addEventListener('DOMContentLoaded', function(){ 
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log("function called");
        
        // clear body to start next page 
        var b = document.getElementsByTagName("body")[0];
        var html = b.parentNode
        b.parentNode.removeChild(b);
        var newBody = document.createElement("body");
        html.appendChild(newBody);
        console.log("function done");

        //define card
        var card = document.createElement("div");
        card.setAttribute("class", "card first");
        newBody.appendChild(card);

        var cardImg = document.createElement("div");
        cardImg.setAttribute("class", "card-image");
        card.appendChild(cardImg);

        var doggiePic = document.createElement("img");
        doggiePic.setAttribute("src", "");
        doggiePic.setAttribute("class", "img-responsive");
        doggiePic.setAttribute("id", "doggiePic")
        cardImg.appendChild(doggiePic);

        // welcome back message
        var mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "card-header");

        var mapLink = document.createElement("a");
        mapLink.setAttribute("href", "https://iyung.github.io/mhacks11map/");
        mapLink.setAttribute("target", "_blank");
        mapLink.setAttribute("class", "float-right");
        mapLink.innerHTML = "See local ratings";
        mainDiv.appendChild(mapLink);

        var mainTitle = document.createElement("div");
        mainTitle.setAttribute("class", "card-title h5");
        mainTitle.innerHTML = "Welcome back!"
        mainDiv.appendChild(mainTitle);

        // get user name from login info that was saved to chrome 
        chrome.storage.local.get("user", function(result) {

          console.log(user);
          user = result.user;

          var userTitle = document.createElement("div");

          userTitle.setAttribute("class", "card-subtitle text-gray");
          userTitle.innerHTML = user;
          
          mainDiv.appendChild(userTitle);
          card.appendChild(mainDiv);

          var cardBody = document.createElement("div");
          cardBody.setAttribute("class", "card-body");

          index.getObject(user, function(err, content) {
            if (err) {
              cardBody.innerHTML = "Your account has bben created! Please close and reopen the popup.";
              card.appendChild(cardBody);
            }
            if (content) {
              reddit = content.reddit ? content.reddit : "";
              Score = content.score;
              cardBody.innerHTML = "Pawsitivity Rating: " + Score;
              card.appendChild(cardBody);
              var chosenImg ="https://i.imgur.com/FjgwkLp.gif";
              if (Score>5) {
                chosenImg = "https://i.imgur.com/rG3DP0P.gif"
              } else if (Score<0) {
                chosenImg = "https://i.imgur.com/NY38nL2.gif";
              }
              document.getElementById("doggiePic").setAttribute("src", chosenImg);

              var formRow = document.createElement("div");
              formRow.setAttribute("class", "columns space-top");
              var leftCol = document.createElement("div");
              leftCol.setAttribute("class", "column col-9");
              var rightCol = document.createElement("div");
              rightCol.setAttribute("class", "column col-3");

              var txtRedditUser = document.createElement('input');
              txtRedditUser.setAttribute("class","form-input");
              txtRedditUser.type = "text";
              txtRedditUser.id = "redditUser"
              txtRedditUser.placeholder = "Reddit User Name";
              txtRedditUser.value = reddit;
              leftCol.appendChild(txtRedditUser);

              var btnRedditSave = document.createElement("button");
              btnRedditSave.setAttribute("class","btn btn-primary fluid");
              btnRedditSave.textContent = "Save";
              rightCol.appendChild(btnRedditSave);

              formRow.appendChild(leftCol);
              formRow.appendChild(rightCol);

              cardBody.appendChild(formRow);

              btnRedditSave.addEventListener('click', e => {
                reddit = txtRedditUser.value;
                console.log(reddit);
                updateIndex();
                console.log(reddit + " after calling function");
              });

              if(reddit != ""){

                var footer = document.createElement("div");
                footer.setAttribute("class", "card-footer");
                var history = document.createElement("a");
                history.setAttribute("href", "../page/page.html");
                history.setAttribute("target", "_blank");
                history.innerHTML = "See recent posts";

                footer.appendChild(history);
                card.appendChild(footer);

              }
            }
          })
        });
      }
    })
  });