document.getElementById("contact").onclick = () => {
  window.location = "./companies.html";
};

/**
 * Retrivies the result (which includes the estimated saving) from 
 * the database and displays it. 
 */
document.body.onload = async function () {
  let id = await getResult();
  if (id === undefined) {
    window.location = "../404.html";
  }

};

/**
 * This function copies the link of the page to the clipboard. 
 */
document.getElementById("share").onclick = function () {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert("Copied the link to the clipboard, use can use this link" +
      "to see this page again.");
  });
};

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

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();

/**
 * Searches the result id specified in the url in the database and returns it if
 * it exists.
 *
 * @return {Promise<String|null>} returns the id of the result if it was found in the database
 * or null if it was not found.
 */
async function getResult() {
  let url = window.location.href;

  // The id of the result is the number after '#' in the url. 
  let index = url.indexOf("#");
  if (index === -1) {
    window.location = '404.html';
  }

  let id = url.substring(index + 1);
  let result = await checkInDatabase(id);

  // redirect to 404.html if the id is wrong. 
  if (result.data() === undefined) {
    window.location = '404.html';
  }

  document.getElementById("result").innerHTML += `<h1>You will
    be saving $ ${result.data().estimatedYearlySavings} Every year</h1>`;

  return result;
}

/**
 * Checks if the given result id exists in the database. Returns true if it does and
 * false othersie.
 *
 * @param {String} resultId - the id of the result to search.
 * @return {Promise<Boolean>} whether or not the result id exists in cloud firestore.
 */
async function checkInDatabase(resultId) {
  let resultCollection = db.collection("results");
  let doc = await resultCollection.doc(resultId).get();
  return doc;
}