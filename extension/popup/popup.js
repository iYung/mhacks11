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

// get elements 

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById('btnLogout');

//document.addEventListener('DOMContentLoaded', function() {alert("good")});
document.addEventListener('DOMContentLoaded', function(){
if (btnLogin){
  console.log("here");
    btnLogin.addEventListener('click' , e => {
      //check for real email 
      const email = txtEmail.value;
      const pass = txtPassword.value;
      const auth = firebase.auth();
      //sign in 
      const promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));

      // Save it using the Chrome extension storage API.
      chrome.storage.local.set({'user': email}, function() 
      {
        // Notify that we saved.
        console.log('Settings saved');
      });
      });}

     
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

    chrome.storage.local.set({'user': email}, function() 
    {
      console.log('Settings saved');
      index.addObject({
        objectID: email,
        score: 0
      }, function(err, content) {
        console.log('objectID=' + content.objectID);
      });
    });

    });}
    

    if(btnLogout){
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut();
    });}
    
    //realtime authenticaiton listener
    
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        //console.log(firebaseUser);
        //btnLogout.classList.remove('hide');
        console.log("function called");
        
        var b = document.getElementsByTagName("body")[0];
        var html = b.parentNode
        b.parentNode.removeChild(b);
        var newBody = document.createElement("body");
        html.appendChild(newBody);
        console.log("function done");

        chrome.storage.local.get("user", function(result) {
          user = result.user;
          console.log(user + "  hi there");
          getName = user;
        var name= document.createTextNode(getName);
        p.appendChild(t);
        welcome.appendChild(p); 
        welcome.appendChild(name) ;
        mainDiv.appendChild(welcome);
        })

        var mainDiv = document.createElement("div");
        newBody.appendChild(mainDiv);
        var welcome = document.createElement("h3");
        var p = document.createElement("p");
        var t = document.createTextNode("Welcome back!");       // Create a text node
        
        //FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
      
        var nice = document.createElement('h2')
        
        var NicenessScore = 5;
        var dispNiceness= document.createTextNode("Niceness Rating:  " + NicenessScore);
        nice.appendChild(dispNiceness);
        mainDiv.appendChild(nice);
        var dogPic = document.createElement("img");
        if (NicenessScore > 0)
        {
        dogPic.src = "https://i.imgur.com/rG3DP0P.gif";
        //var src = document.getElementById("header");
        
        }
        else if (NicenessScore< 0) {
          dogPic.src = "https://i.imgur.com/NY38nL2.gif";
        }
        else 
        {
          dogPic.src = "https://i.imgur.com/FjgwkLp.gifv";
        }
        mainDiv.appendChild(dogPic);
        var seeMore = document.createElement('a');
        seeMore.href = "https://iyung.github.io/mhacks11map/";
        seeMore.target = "_blank";
        seeMore.classList.add("links")
        var seeMoreText = document.createTextNode("see more");
        seeMore.appendChild(seeMoreText);
        mainDiv.appendChild(seeMore);
      }
      else {
        console.log("not logged in");
        btnLogout.classList.add('hide');
        console.log("not null");
      }
    });
  });
