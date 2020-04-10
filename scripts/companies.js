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

var db = firebase.firestore();

/**
 * Retrieves the collectino of companies the the database and returns 
 * them as a promise. 
 *  
 * @param {Promise<Object|null>} name 
 */
async function getCompanies(name) {
  return await db.collection("companies").get();
}

(async () => {
  let companies = await db.collection("companies").get();
  companies.forEach((company) => {
    document.getElementById("companies").innerHTML += `<h3 id=${company.id}>${
      company.data().name
    }</h3>`;
    let companyEl = document.getElementById(company.id);
    companyEl.style = "cursor: pointer;";
    console.log("adding event listener");
    companyEl.onclick = () => {
      companyEl.style = "solid blue 2px; cursor: pointer;";
      let message = {
        bill: localStorage.getItem("bill"),
        budget: localStorage.getItem("budget"),
        email: localStorage.getItem("email"),
        message: localStorage.getItem("message"),
        name: localStorage.getItem("name"),
        "roof-pitch": localStorage.getItem("roof-pitch"),
        zipcode: localStorage.getItem("zipcode"),
      };
      db.collection("requests")
        .add(message)
        .then((docRef) => {
          db.collection("companies")
            .doc(company.id)
            .update({
              messages: firebase.firestore.FieldValue.arrayUnion(docRef.id),
            });
        });
    };
  });
})();
