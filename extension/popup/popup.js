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
    });}
    

    if(btnLogout){
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut();
    });}
    
    //realtime authenticaiton listener
    
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser);
        btnLogout.classList.remove('hide');
      }
      else {
        console.log("not logged in");
        btnLogout.classList.add('hide');
        console.log("not null");
      }
    });
  });


