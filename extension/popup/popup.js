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

window.onload=function(){
  document.addEventListener('DOMContentLoaded', function(){
  btnSignUp.addEventListener('click' , e => {
    //check for real email 
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //sign in 
    const promise = auth.createUserWithEmailAndPassword(email,password);
    promise.catch(e => console.log(e.message));
    promise 
      .then(user => console.log(user))
      .catch(e => console.log(e.message));
    });});
    

    document.addEventListener('DOMContentLoaded', function(){
    btnLogout.addEventListener('click', e => {
      firebase.auth().signOut();
    });});
    
    //realtime authenticaiton listener
    document.addEventListener('DOMContentLoaded', function(){
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser);
        btnLogout.classList.remove('hide');
      }
      else {
        console.log("not logged in");
        btnLogout.classList.add('hide')
      }
    });});
}

