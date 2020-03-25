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
  document.getElementById("sun-hours").innerHTML = "1214 hours of sunlight";
  document.getElementById("area").innerHTML =
    area + " squared meters available for solar panels";

  document.getElementById("buttons").style.visibility = "visible";
}

document.getElementById("prev").onclick = () =>
  (window.location = "./bill.html");
document.getElementById("next").onclick = () =>
  (window.location = "./result.html");
