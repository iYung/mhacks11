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
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

btnLogin.addEventListener('click', e =>{
// get email and password
const email = txtEmail.value;
const pass = txtPassword.value;
const auth = firebase.auth();
//sign in 
const promise = auth.signInWithEmailAndPassword(email,password);
promise.catch(e => console.log(e.message));
});
