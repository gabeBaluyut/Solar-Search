let name = localStorage.getItem("name");
document.getElementById("account").innerHTML = name;

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
let db = firebase.firestore();

(async () => {
  let reuslt;
  let matchedCompanies = await db.collection("companies").get();
  matchedCompanies.forEach((company) => {
    result = company;
  });
  let messagesIds = result.data().messages;
  let messagePromises = [];
  messagesIds.forEach((messageId) =>
    messagePromises.push(db.collection("requests").doc(messageId).get())
  );
  let messages = await Promise.all(messagePromises);
  messages.forEach((message) => {
    let listItem = `<a id=${
      message.id
    } class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${message.data().name}</h5>
          <small class="text-muted">3 days ago</small>
        </div>
      </a>`;
    document.getElementById("requests").innerHTML += listItem;
  });
})();
