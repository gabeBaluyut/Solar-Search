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
 * Creates a list item that represents a message item. This item can will be a DOM element.
 * @param {String} name - the name of the person who sent the message.
 * @param {String} time - time passed since the message was sent.
 * @param {Boolean} isHandled - shows whether or not the message is handled (seen)
 * @return {HTMLElement} - an element representing the message
 */
function crateListItem(name, timePassed, isHandled) {
  let element = document.createElement("a");
  element.setAttribute(
    "class",
    "list-group-item list-group-item-action flex-column align-items-start"
  );

  // the container the hold the information.
  let container = document.createElement("div");
  container.setAttribute("class", "d-flex w-100 justify-content-between");

  // element showing the name.
  let nameElement = document.createElement("h5");
  nameElement.setAttribute("class", "m-1");
  nameElement.innerHTML = name;

  // element showing the time passed since the message was sent.
  let dateElement = document.createElement("small");
  dateElement.setAttribute("class", "text-muted");
  dateElement.innerHTML = timePassed + " ago";

  container.append(nameElement, dateElement);
  element.appendChild(container);

  if (isHandled) {
    element.classList.add("list-group-item-success");
  } else {
    element.classList.add("list-group-item-warning");
  }

  return element;
}

/**
 * Adds a click event listener to the item with the given id.
 *
 * @param {String} itemId - the id of the element
 */
function addClickHandler(itemId) {
  let item = document.getElementById(itemId);

  item.addEventListener("click", () => {
    $("#exampleModal").on("shown.bs.modal", function () {
      $("#button-modal").trigger("focus");
    });

    $(document).ready(function () {
      $(".modal").modal("show");
    });

    $("#exampleModal").modal("show");
  });
}

/**
 * Gets messages and adds them to the DOM.
 *
 * @param {Array} the list of messages
 */
function addMessagesToDom(messages) {
  // add the to the DOM
  messages.forEach((message) => {
    // name of the person who sent the message.
    let name = message.data().name;

    // time passed since the message was sent.
    let timePassed = timeEllapsedSince(message.data().date.seconds);

    // is the message seen
    let isHandled = message.data().seen;

    let element = crateListItem(name, timePassed, isHandled);
    element.setAttribute("id", message.id);

    if (isHandled) {
      document.getElementById("handled-requests").appendChild(element);
    } else {
      document.getElementById("unhandled-requests").appendChild(element);
    }

    addClickHandler(message.id);
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
