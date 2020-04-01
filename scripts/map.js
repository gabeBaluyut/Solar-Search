function initMap() {
  const BULDING_ZOOM_LEVEL = 20;

  let lat = parseInt(localStorage.getItem("lat"));
  let lng = parseInt(localStorage.getItem("lng"));

  let map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 49.337081,
      lng: -123.168304,
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

function handleOverlayComplete(event) {
  let polygon = event.overlay;

  let area = google.maps.geometry.spherical.computeArea(polygon.getPath());
  area = Math.floor(area);

  document.getElementById("zas").innerHTML = "Area Selected";
  document.getElementById("sun-hours").innerHTML =
    localStorage.getItem("sunlight-hours") + " hours of sunlight";
  document.getElementById("area").innerHTML =
    area + " squared meters available for solar panels";

  document.getElementById("buttons").style.visibility = "visible";
}

const API_KEY = "EZoptKV6PYEMS96BDpgJH7QaTfMeRlvHD7Uf7RTq";
const URL = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?";

async function fetchData(lat, lng) {
  let path = URL + "api_key=" + API_KEY + "&lat=" + lat + "&lon=" + lng;

  let data = await fetch(
    "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=EZoptKV6PYEMS96BDpgJH7QaTfMeRlvHD7Uf7RTq&lat=49&lon=-123"
  );
  let jsonData = await data.json();
  return jsonData;
  // console.log(jsonData);
}

async function getYearlySolarHours() {
  let data = await fetchData(
    localStorage.getItem("lat"),
    localStorage.getItem("lng")
  );
  let result = data.outputs.avg_dni.annual * 365;
  localStorage.setItem("sunlight-hours", result);
  console.log(localStorage.getItem("sunlight-hours"));
  return result;
}

document.getElementById("prev").onclick = () =>
  (window.location = "./bill.html");
document.getElementById("next").onclick = () =>
  (window.location = "./result.html");
