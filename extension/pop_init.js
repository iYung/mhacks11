var firebase = require('./firebase.js');
var firebaseui = require('./firebaseui.js');
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
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());