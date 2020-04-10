/**
 * Initiates the map.
 */
function initMap() {
  const BULDING_ZOOM_LEVEL = 20;

  // lat and lng were stored in the local storage in index.html. 
  let lat = parseInt(localStorage.getItem("lat"));
  let lng = parseInt(localStorage.getItem("lng"));

  let map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: BULDING_ZOOM_LEVEL,
    mapTypeId: "satellite",
    tilt: 0,
  });

  let drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingMode: ["polygon"],
    },
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(
    drawingManager,
    "overlaycomplete",
    handleOverlayComplete
  );
}


/**
 * Event handler function that will be triggered when the user has finished drawing
 * the polygon.
 *
 * @param {Event} event - the overlaycomplete event
 * @listens overlaycomplete
 */
function handleOverlayComplete(event) {
  let polygon = event.overlay;

  let area = google.maps.geometry.spherical.computeArea(polygon.getPath());
  area = Math.floor(area);

  // storing the area to the local storage. 
  setArea(area);

  document.getElementById("zas").innerHTML = "Area Selected";

  getYearlySolarHours().then(
    (result) => {
      document.getElementById("sun-hours").innerHTML =
        result + " hours of sunlight";
      localStorage.setItem("daily-sunligh-hours", result / 365);
    }
  );

  document.getElementById("area").innerHTML =
    area + " squared meters available for solar panels";

  document.getElementById("buttons").style.visibility = "visible";
  document.getElementById("mapa").style.display = "none";

  createResult();
}

const API_KEY = "EZoptKV6PYEMS96BDpgJH7QaTfMeRlvHD7Uf7RTq";
const URL = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?";

/**
 * Fetches and returns solar resources data.
 *
 * @param {String|Number} lat - the latitude of the location.
 * @param {String|Number} lng - the longtitude of the location.
 * @return {Promise<Object>} the fetched data from solar resources api.
 */
async function fetchData(lat, lng) {
  let path =
    URL + "api_key=" + API_KEY + "&lat=" + lat + "&lon=" + lng;

  let data = await fetch(path);
  let jsonData = await data.json();
  return jsonData;
}

/**
 * Calculates and returns the daily 
 * output of solar panels if they were installed 
 * on the roof of the user's house. 
 *
 * @return a Number representing the output of the solar panels in kWatts. 
 */
function calculateSolarpanelOutput() {
  // the average energy production of a solar panel in watts/hours
  let averageSolarpanelProduction = 250;
  // allocated roof area in squared meters 
  let area = localStorage.getItem("area");
  // average solar panel efficieny percentage. 
  let efficieny = 75 / 100;
  // average hours of sunlight in a day in the given location (kWh/m^2/day) 
  let averageHoursOfSunlight = localStorage.getItem("daily-sunligh-hours");

  return averageSolarpanelProduction * efficieny * averageHoursOfSunlight;
}

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

var db = firebase.firestore();

/**
 * Creates a result in the database. 
 * A result consists of the information that the user entered and their 
 * estimated savings. It will be stored in the database so that the user 
 * can access in again via a link.
 * 
 * @returns true if the database was successfully updated.  
 */
async function createResult() {
  let resultObject = {
    location: {
      lat: localStorage.getItem("lat"),
      lng: localStorage.getItem("lng")
    },
    averageHoursOfSunlight: localStorage.getItem("daily-sunligh-hours"),
    solarPanelProduction: calculateSolarpanelOutput(),
    bill: localStorage.getItem("bill"),
    roofPitch: localStorage.getItem("roof-pitch"),
    allocatedRoofArea: localStorage.getItem("area"),
    estimatedYearlySavings: calculateEstimatedSavings()
  };
  let results = await db.collection("results");
  let gotResult = await results.get(); 
  let docId = gotResult.size; 
  
  localStorage.setItem("docId", docId);

  let wasSuccessfullyUpdated = true;
  await results.doc(docId + "").set(resultObject).catch(err => {
    console.log("An error occured while adding the result object " +
      "to the database" + err);
    wasSuccessfullyUpdated = false;
  });
  return wasSuccessfullyUpdated;
}

/**
 * Calculates and returns the estimated savings every year.  
 * 
 * @return {Number} the yearly estimated savings in dollars. 
 */
function calculateEstimatedSavings() {
  // the average cost of energy in canada (Canadian $/kWh)
  const ENERGY_COST = 9; 
  const KILLO = 1000; 
  return calculateSolarpanelOutput() * ENERGY_COST * 365 / KILLO; 
}

/**
 * Returns the number of sunlight hours in a year in the current location.
 *
 * @return {Promise<Number>} number of yearly sunlight hours in the current location.
 */
async function getYearlySolarHours() {
  let data = await fetchData(
    localStorage.getItem("lat"),
    localStorage.getItem("lng")
  );

  let result = data.outputs.avg_dni.annual * 365;
  localStorage.setItem("sunlight-hours", result);
  return result;
}

/**
 * Stores the given area in the local storage.
 * 
 * @param {Number} area 
 */
function setArea(area) {
  localStorage.setItem("area", area); 
}

document.getElementById("prev").onclick = () =>
  (window.location = "./bill.html");
document.getElementById("next").onclick = () =>
  (window.location = "./result.html#" + localStorage.getItem("docId"));