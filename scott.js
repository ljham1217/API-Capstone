const apiKey = 'AIzaSyCKApVZv6tYGic3lfJ-dVWtpM0zHtu-QMw';

$(function(){
    console.log('App loaded! Waiting for submit!');
    watchForm();
});

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const location= $('#search_criteria').val();
        getGeo(location);

    })
}

////// function to get the lat & lng from the address entered in search bar ////
function getGeo(location) {
    console.log('getting the coordinates');
    location_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${location}`;
 
     fetch(location_URL)
     .then(response => {
         if (response.ok) {
           return response.json();
         }
         throw new Error(response.statusText);
       })
       //.then(responseJson => initialize(responseJson))
       .then(responseJson => getResults(responseJson))
       .catch(err => {
         $('#js-error-message').text(`Something went wrong: ${err.message}`);
       });
}


 //////////////////////// initialize the map with the address lat & lng  AND get the farmers markets in that region /////////
function getResults(responseJson) {
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


    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service locSearch
        url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
                var marketId = []; 
                var marketName = []; 
                $.each(data.results, function (i, val) {
                    marketId.push(val.id);
                    marketName.push(val.marketname);
                }); 
                console.log(marketName.toString());
                getMarketDetails(marketId, marketName);
            }//end of function(data)
    });//end of ajax call
}//end of getResults
 
 
 function getMarketDetails(arrMarketId, marketName) {
    console.log(arrMarketId.toString());
    
    //var counter = 0;//use to match marketname
    $.each(arrMarketId, function(i, val) {
       //console.log(val);
       $.ajax({
           type: "GET",
           contentType: "application/json; charset=utf-8",
           url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=1002275",
           dataType: 'jsonp',
           success: function(data) {
                for (var key in data) {
                var results = data[key];
                console.log(results);

                var infowindow = null;
                
                infowindow = new google.maps.InfoWindow({
                    contenot: ""
                });
                    
                
                let address = results['Address'];
                console.log(address);

                let request = {
                    query: address,
                };
            
                service = new google.maps.places.PlacesService(map);
            
                service.textSearch(request, function(results, status) {
                    if(status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                                createMarker(results[i], marketName[i]);
                            }
                        }
                    });                   
                } //end of for loop   
         
            }//end of function(data) 
          
         });//end of $.ajax call 
     });//end of $.each(arrMarketId, function(i, val)
   } //end of getMarketDetails

   function createMarker(place, marketName) {
    console.log('I need to add a marker');
    console.log(place);
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + marketName + '</strong><br>' +
        place.Address + '</div>');

        infowindow.open(map, this);
    });
}

    // var latLong = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.lastIndexOf("(")));
    //                     //console.log('latLong=>' + latLong);
                        
    //                     var split = latLong.split(',');
    //                     //console.log(split);
                        
    //                     var latitude = parseFloat(split[0]);
    //                     var longitude = parseFloat(split[1]);
    //                     //console.log(latitude);
    //                     //console.log(longitude);
                        
    //                     myLatlng = new google.maps.LatLng(latitude,longitude);
        
    //                 allMarkers = new google.maps.Marker({
    //                         icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    //                         position: myLatlng,
    //                         map: map,
    //                         title: marketName[counter],
    //                         html: 
    //                             '<div class="markerPop">' +
    //                             '<h1>' + marketName[counter].substring(4) + '</h1>' + 
    //                             '<h3>' + results['Address'] + '</h3>' +
    //                             '<p>' + results['Products'].split(';') + '</p>' +
    //                             '<p>' + results['Schedule'] + '</p>' +
    //                             '</div>',
    //                     });//end of allMarkers 
                        
    //                     allLatlng.push(myLatlng);
                        
    //                     tempMarkerHolder.push(allMarkers);
                
    //                     counter++;
    //                     //console.log(counter);
    //                     google.maps.event.addListener(allMarkers, 'click', function () {
    //                     infowindow.setContent(this.html);
    //                     infowindow.open(map, this);
    //                     }); 
                        
    //                     // event to close the infoWindow with a click on the map
    //                     google.maps.event.addListener(map, 'click', function() {
    //                         infowindow.close();
    //                     });                        
                        
    //                     //  Make an array of the LatLng's of the markers you want to show
                        
    //                     var bounds = new google.maps.LatLngBounds ();


    // function initialize(responseJson) {
//     console.log('initializing the map')
//     console.log(responseJson);

//     let lat= responseJson.results[0].geometry.location.lat;
//     let lng= responseJson.results[0].geometry.location.lng;

//     let center = new google.maps.LatLng(lat,lng);
//     console.log(lat, lng);
    
//     infowindow = new google.maps.InfoWindow();

//     map = new google.maps.Map(document.getElementById('map'), {
//       center: center,
//       zoom: 13
//     });

//     let request = {
//         location: center,
//         //rankBy: google.maps.places.RankBy.DISTANCE,
//         radius: 16000,
//         name: "farmers market",
//     };

//     service = new google.maps.places.PlacesService(map);

//     //service.nearbySearch(request, callback);
//     service.nearbySearch(request, function(results, status) {
//         if(status === google.maps.places.PlacesServiceStatus.OK) {
//             for (let i = 0; i < results.length; i++) {
//                 let name = results[i].name;
//                 let string = "farmers market";
//                 if (name.search(string)) {
//                     createMarker(results[i]);
//                 }
//             }
//         }
//     });

// }

// window.initMap = function(){
//     // Resonsive google map
//      google.maps.event.addDomListener(window, "resize", function() {
//         var center = map.getCenter();
//         google.maps.event.trigger(map, "resize");
//         map.setCenter(center); 
//  });
   
//    var markers = [];
//     map = new google.maps.Map(document.getElementById('google_map'), {
//      center: {lat: 40.9, lng: -97.2},
//      zoom: 4,
//      mapTypeId: 'roadmap'
//    });//end of map
   
//    //add click event to get latitude and longitude
//          map.addListener('click', function(e) {
//          var latitude = e.latLng.lat();
//          //alert('latitude= '+latitude);
//          var longitude = e.latLng.lng();
//          //alert('longitude= '+longitude);
//          document.getElementById('textbox1').value = latitude;
//          document.getElementById('textbox2').value = longitude;
//          var locationCoords = 'Latitude: '+latitude+', Longitude: '+longitude;
//          //console.log(locationCoords);
//          var marker = addMarker(map, {lat:latitude, lng:longitude});
         
//    //remove previous marker and add new one
//          removeMarker(null, markers);
//    //now to push the marker in markers array in order to remove them
//          markers.push(marker);
//          getResults(longitude, latitude);
        
     
//    });//end of click listener
    
//  }//end of initMap(called in API script)
 
    //to remove markers so map only displays one
//     function removeMarker(map, markers) {
//       for(var i=0; i<markers.length;i++) {
//         markers[i].setMap(map);
//         //console.log(markers[i]);
//       }
//     }//end of removeMarker
    
//     //now add marker when user clicks and add array having Lat/Lng
//    function addMarker(map, center) {
//      return new google.maps.Marker({
//      position: center,
//      animation: google.maps.Animation.DROP,
//      label: "M",
//      map: map,
//      });
//  }//end of addMarker
 
 
 