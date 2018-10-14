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

function updateIndex() {
  index.partialUpdateObject({
    reddit: reddit,
    objectID: user
  }, function(err, content) {
    if (err) throw err;
    console.log(content);
  });
}

// get elements 
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById('btnLogout');

//login authentication 
//wrapped around even listener to ensure page loads first 
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

      chrome.storage.local.set({'user': email}, function() 
      {
        // Notify that we saved.
        console.log('Settings saved');
      });

    });
  }
});
    
document.addEventListener('DOMContentLoaded', function(){ 
    if(btnLogout){
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut();
    });}
  });
    
    //realtime authenticaiton listener
 document.addEventListener('DOMContentLoaded', function(){ 
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        //console.log(firebaseUser);
        //btnLogout.classList.remove('hide');
        console.log("function called");
        
        // clear body to start next page 
        var b = document.getElementsByTagName("body")[0];
        var html = b.parentNode
        b.parentNode.removeChild(b);
        var newBody = document.createElement("body");
        html.appendChild(newBody);
        console.log("function done");

        // get user name from login info that was saved to chrome 
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
        // welcome back message
        var mainDiv = document.createElement("div");
        newBody.appendChild(mainDiv);
        var welcome = document.createElement("h3");
        var p = document.createElement("p");
        var t = document.createTextNode("Welcome back!");       // Create a text node
        
      
        
        // get and display score for user in pop up
        var nice = document.createElement('h2')
        var Score = 0; //default zero 
        chrome.storage.local.get('user', function(result) {
          if (result.user) {
          user = result.user;
          index.getObject(user, function(err, content) {
            if (content) {
             Score = content.score;
             var dispNiceness= document.createTextNode("Niceness Rating:  " + Score);
          nice.appendChild(dispNiceness);
          mainDiv.appendChild(nice);
          var dogPic = document.createElement("img");
          if (Score > 0)
          {
          dogPic.src = "https://i.imgur.com/rG3DP0P.gif";        
          }
          else if (Score< 0) {
            dogPic.src = "https://i.imgur.com/NY38nL2.gif";
          }
          else 
          {
            dogPic.src = "https://i.imgur.com/FjgwkLp.gifv";
          }
          mainDiv.appendChild(dogPic);
          // leading to map 
          var seeMore = document.createElement('a');
          seeMore.href = "https://iyung.github.io/mhacks11map/";
          seeMore.target = "_blank";
          seeMore.classList.add("links")
          var seeMoreText = document.createTextNode("see more");
          seeMore.appendChild(seeMoreText);
          mainDiv.appendChild(seeMore);
            //leading to history 
            var seeHist = document.createElement('a');
            seeHist.href = "https://iyung.github.io/mhacks11map/";
            seeHist.target = "_blank";
            seeHist.classList.add("links")
            var seeHistText = document.createTextNode("see History");
            seeHist.appendChild(seeHistText);
            mainDiv.appendChild(seeHist);
  

            //Reddit User name Textbox 
        var txtRedditUser = document.createElement('input');
        txtRedditUser.type = "text";
        txtRedditUser.id = "redditUser"
        txtRedditUser.placeholder = "Reddit User Name";
        mainDiv.appendChild(txtRedditUser);
        index.getObject(user, function(err, content) {
          if (content) {
            console.log(content + "  content");
            reddit = content.reddit;
            console.log(reddit + "   before filling in txt box");
            txtRedditUser.value = reddit;
          } 
        });

        //Reddit User textbox Save button 
        var btnRedditSave = document.createElement("button");
        btnRedditSave.textContent = "save";
        mainDiv.appendChild(btnRedditSave);

        //event listener for reddit save button
        
        btnRedditSave.addEventListener('click', e => {
          reddit = txtRedditUser.value;
          console.log(reddit);
          updateIndex();
          console.log(reddit + " after calling function");
        });
             }
             });
         }; 
        });  
      }
      else {
        console.log("not logged in");
        btnLogout.classList.add('hide');
        console.log("not null");
      }
    });
  });
