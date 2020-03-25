let firebaseConfig = {
  apiKey: "AIzaSyCH6DVqRdYRDyx4s7TrPCSLZ-u6o84L5G8",
  authDomain: "solar-estimate-6b93d.firebaseapp.com",
  databaseURL: "https://solar-estimate-6b93d.firebaseio.com",
  projectId: "solar-estimate-6b93d",
  storageBucket: "solar-estimate-6b93d.appspot.com",
  messagingSenderId: "435826401703",
  appId: "1:435826401703:web:268752d1fa1301011bd682",
  measurementId: "G-GRPESJ7EDF",
};

localStorage.setItem("isLoggedIn", false);

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      let user = authResult.user;
      if (authResult.additionalUserInfo.isNewUser) {
        db.collection("companies")
          .doc(user.uid)
          .set({
            name: user.displayName,
            email: user.email,
            messages: [],
          })
          .then(function () {
            console.log("New user added to firestore");
            window.location.assign("main.html");
          })
          .catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("name", user.displayName);
        return true;
      }
      return false;
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "requests.html",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  tosUrl: "requests.html",
  privacyPolicyUrl: "requests.html",
  accountChooserEnabled: false,
};

ui.start("#firebaseui-auth-container", uiConfig);
