'use strict'
//watch for zipCode submission

const GM_API_KEY = 'AIzaSyCKApVZv6tYGic3lfJ-dVWtpM0zHtu-QMw';
let marketsArray = []; 

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const zipCode= $('#js-zipCode').val();
            getResults(zipCode);
            getGeo(zipCode);
    })
}

////////////// Geolocation Maps /////////////////////////////
function getGeo(zipCode){
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${GM_API_KEY}&components=postal_code:${zipCode}`
    console.log(geoUrl);
    fetch(geoUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => geoLocation(responseJson))
}

function geoLocation(responseJson) {
    console.log('all geo info')
    console.log(responseJson);
    console.log('lat: ' + responseJson.results[0].geometry.location.lat);
    console.log('long: ' + responseJson.results[0].geometry.location.lng);
    let lat = responseJson.results[0].geometry.location.lat;
    let lng = responseJson.results[0].geometry.location.lng;
    console.log(lat);
    console.log(lng);
}

window.initMap = function(){
    // Resonsive google map
     google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center); 
 });


//////////////////// Farmers Markets Api //////////////////////////////////////

function getResults(zipCode) {
    fetch('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zipCode)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(idResponseJson => makeIdArray(idResponseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}


function makeIdArray(idResponseJson) {
    console.log(idResponseJson);
    let idArray= [];  
    let origArray = idResponseJson;  
        $.each(idResponseJson.results, function (i, val) {
            idArray.push(idResponseJson.results[i].id);
        });
    getDetails(idArray);  
    displayResults(origArray);
}

console.log(marketsArray);

function getDetails(idArray) {
        for (let i=0; i < idArray.length; i++) {    
            fetch('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + idArray[i])
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error (response.statusText);
            })
            .then(detailResponseJson => marketsArray.push(detailResponseJson))
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            })          
        }
}


function displayResults(origArray) {
    console.log(origArray.results[0].marketname);
    $('.searchResults').empty();
    for(let i=0; i < origArray.results.length; i++){
                $('.searchResults').append(
                    `<div class="cards">  
                    <h1>${origArray.results[i].marketname}</h1>               
                    </div>`
                );
    }
      $('#js-results').removeClass('hidden');
}

/*function displayDetails(marketsArray) {
    for(let i=0; i < marketsArray.length; i++){
        $('cards').find('${i}').text("${marketsArray[i].marketdetails.Address}") }
    console.log('can I log the paragraph?')
}*/

/*$('.searchResults').empty();
    
    for (let i=0; i < detailresults.length; i++)
    
    $('.searchResults').append(
        `<div class="cards>
        <h1>${detailresults}</h1>
        </div>`
    );
    $('#js-results').removeClass('hidden');
)   detailresults, function (i, val) {
        detailresults.push(val.marketdetails);
        console.log(marketDetail);
    })
for (var key in detailresults) {
    console.log(key);
    var results = detailresults[key];
    displayResults(results);
}*/

$(function(){
    console.log('App loaded! Waiting for submit!');
    watchForm();
})