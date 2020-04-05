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

localStorage.setItem("company-id", "xpOd4QDU8XRX5KHlpXH1SPRCZzk2");
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

(async function () {
  let messages = await getMessages();
  addMessagesToDom(messages);
})();

/**
 * Retrives the messages of the company that is logged in from the database
 * and returns them.
 *
 * @return {Array} messages of the company that is logged in.
 */
async function getMessages() {
  // get the company's data from the database
  let companyId = localStorage.getItem("company-id");
  let company = await db.collection("companies").doc(companyId).get();

  // get its messages
  let messageIds = company.data().messages;
  let messagePromises = [];
  messageIds.forEach((messageId) =>
    messagePromises.push(db.collection("requests").doc(messageId).get())
  );
  let messages = await Promise.all(messagePromises);

  return messages;
}

/**
 * Gets messages and adds them to the DOM.
 *
 * @param {Array} the messages
 */
function addMessagesToDom(messages) {
  // add the to the DOM
  messages.forEach((message) => {
    let element = document.createElement("a");
    element.setAttribute("class", 
      "list-group-item list-group-item-action flex-column align-items-start");

    let container = document.createElement("div");
    container.setAttribute("class", "d-flex w-100 justify-content-between");

    let nameElement = document.createElement("h5");
    nameElement.setAttribute("class", "m-1");
    nameElement.innerHTML = message.data().name;

    let dateElement = document.createElement("small");
    dateElement.setAttribute("class", "text-muted");
    dateElement.innerHTML =
      timeEllapsedSince(message.data().date.seconds) + " ago";

    container.append(nameElement, dateElement);
    element.appendChild(container);

    if (message.data().seen) {
			element.classList.add("list-group-item-success"); 
      document.getElementById("handled-requests").appendChild(element);
    } else {
			element.classList.add("list-group-item-warning"); 
      document.getElementById("unhandled-requests").appendChild(element);
    }
  });
}

/**
 * Gets the number of seconds and converts it to human readable time. This causes a loss of
 * precision. For example 70 seconds is converted to 1 minute.
 *
 * @param {Number} seconds - the number of seconds to convert
 * @return {String} the converted time in a human readable way.
 */
function secondsToReadableTime(seconds) {
  if (seconds < 60) return seconds + " seconds";

  let minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + " minutes";

  let hours = Math.floor(minutes / 60);
  if (hours < 60) return hours + " hours";

  let days = Math.floor(hours / 24);
  return days + " days";
}

/**
 * Returns the time ellapsed since the specified time.
 *
 * @param {Number} time - number of seconds ellapsed since epoch.
 * @return {String} the time ellapsed in a human-readable way (see secondsToReadableTime)
 */
function timeEllapsedSince(time) {
  let seconds = Date.now() / 1000;
  let ellapsedSeconds = seconds - time;
  return secondsToReadableTime(ellapsedSeconds);
}
