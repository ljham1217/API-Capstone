///////////////////////// Global Attributes ///////////////////////////

const apiKey = 'AIzaSyCKApVZv6tYGic3lfJ-dVWtpM0zHtu-QMw';
const searchPlaces_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';


let map;
let service;
let infowindow;


////////////////////////// get locations from field input ////////////////////////////////////////
function getGeo(location) {
   location_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${location}`;

    fetch(location_URL)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => initialize(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

/*function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getPlaces(responseJson) {
    console.log('all geo info')
    console.log(responseJson);
    let lat= responseJson.results[0].geometry.location.lat;
    let lng= responseJson.results[0].geometry.location.lng;

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const places_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&`;
    
    const params = {
        query: 'farmers market',
        location: [lat,lng],
        radius: 10000,
    }

    const queryString = formatQueryParams(params)
    const url = places_URL + queryString;

    console.log(url);

    fetch(proxyurl + url) 
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(placesData => initialize(placesData))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}*/


//////////////////////// display details on page ////////////////////////////////////

function displayData(results) {
    console.log('displaying the data');
    console.log(results[0].name);
    $('.searchResults').empty();
    for(let i=0; i < results.length; i++){
            if (results[i].name.includes("Farmers Market")) {
                $('.searchResults').append(
                    `<div class="cards">  
                    <h1>${results[i].name}</h1>  
                    <p>${results[i].vicinity}</p>             
                    </div>`
                );
    }
      $('#js-results').removeClass('hidden');
}
}


/////////////////////////////////// MAP //////////////////////////////////////
function initialize(responseJson) {
    console.log('initializing the map')
    console.log(responseJson);

    let lat= responseJson.results[0].geometry.location.lat;
    let lng= responseJson.results[0].geometry.location.lng;

    let center = new google.maps.LatLng(lat,lng);
    console.log(lat, lng);
    
    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 13
    });

    let request = {
        location: center,
        //rankBy: google.maps.places.RankBy.DISTANCE,
        radius: 16000,
        name: "farmers market",
    };

    service = new google.maps.places.PlacesService(map);

    //service.nearbySearch(request, callback);
    service.nearbySearch(request, function(results, status) {
        if(status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
                let name = results[i].name;
                let string = "farmers market";
                if (name.search(string)) {
                    createMarker(results[i]);
                }
            }
        }
    });

}

// function callback(results, status) {
//     console.log(results);
//     if(status === google.maps.places.PlacesServiceStatus.OK) {
//         for (let i = 0; i < results.length; i++) {

//             createMarker(results[i]);
//             //getData(results[i]);
//         }
//     //displayData(results);
//     }   
// }

// function getData(places) {
//     let request = {
//         placeId: "ChIJk5rEfvd6ykwRqbJEmRlMn6o",
//     }

//     service.getDetails(request, function(place, status) {
//         console.log(status)
//         if (status == google.maps.places.PlacesServiceStatus.OK) {
//             console.log(place)
//             $('.searchResults').empty();
//             for(let i=0; i < results.length; i++){
//                     if (results[i].name.includes("Farmers Market")) {
//                         $('.searchResults').append(
//                             `<div class="cards">  
//                             <p>${results[i].photos[0].html_attributions}</p> 
//                             <h1>${results[i].name}</h1>  
//                             <p>${results[i].vicinity}</p>             
//                             </div>`
//                         );
//             }
//             $('#js-results').removeClass('hidden');
//         }
//                 }
//             })
// }

function createMarker(place) {
    console.log('I need to add a marker');
    console.log(place);
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        place.vicinity + '</div>');

        infowindow.open(map, this);
    });

}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const location= $('#search_criteria').val();
        getGeo(location);

    })
}

$(function(){
    console.log('App loaded! Waiting for submit!');
    watchForm();
});
