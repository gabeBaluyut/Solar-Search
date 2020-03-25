var firebaseConfig = {
  apiKey: "AIzaSyCH6DVqRdYRDyx4s7TrPCSLZ-u6o84L5G8",
  authDomain: "solar-estimate-6b93d.firebaseapp.com",
  databaseURL: "https://solar-estimate-6b93d.firebaseio.com",
  projectId: "solar-estimate-6b93d",
  storageBucket: "solar-estimate-6b93d.appspot.com",
  messagingSenderId: "435826401703",
  appId: "1:435826401703:web:268752d1fa1301011bd682",
  measurementId: "G-GRPESJ7EDF",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
