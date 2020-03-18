function initMap() {
    const BULDING_ZOOM_LEVEL = 20; 

    let map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: parseInt(localStorage.getItem('lat')),
            lng: parseInt(localStorage.getItem('lng'))
        },
        zoom: BULDING_ZOOM_LEVEL,
        mapTypeId: 'satellite',
        tilt: 0
    });

    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingMode: ['polygon']
        }
    });
    drawingManager.setMap(map); 

    google.maps.event.addListener(drawingManager,
        'polygoncomplete', handlePolygonComplete); 
}

function handleOverlayComplete(event) {
    alert('Overlay Complete!');
}
