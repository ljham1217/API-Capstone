//////////////////////////////////////////////Google Places Api///////////////////////////
function activatePlacesSearch() {
    var input = document.getElementById('search_criteria');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const location= $('#search_criteria').val();
        console.log(location);
    })
}
/*var map;
var infowindow;

function initialize() {
    var center = new google.maps.LatLng(44.4759, -73.2121);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 8
    });

    var request = {
        location: center,
        radius: 8047,
        keyword: ['(farmers) AND (market']
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    console.log(request);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i=0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    })
}*/

