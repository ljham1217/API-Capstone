'use strict'
//watch for zipCode submission

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const zipCode= $('#js-zipCode').val();
        console.log(zipCode);
            getResults(zipCode);
        //.then(date => console.log(data))
    })
}

function getResults(zipCode) {
    fetch('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zipCode)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => makeIdArray(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}

function makeIdArray(responseJson) {
    console.log(responseJson);
    const idArray= [];    
    $.each(responseJson.results, function (i, val) {
        idArray.push(responseJson.results[i].id);
    });
        console.log(idArray);
        getDetails(idArray);       
}

/*function iterateResults(responseJson) {  
    let marketIds = [responseJson];
    let requests = marketIds.map(id => fetch)
    const marketDetailsArray = [];
        $.each(marketdetails, function(i, val){
            marketDetailsArray.push(val.marketdetails);
        });    
};*/

function getDetails(idArray) {
    for (let i=0; i < idArray.length; i++)
    fetch('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + idArray[i] )
    .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error (response.statusText);
    })
    .then (responseJson => marketDetailsArray(responseJson))

    .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function marketDetailsArray(responseJson, idArray) {
    console.log(responseJson);
    const market = [responseJson];
    console.log(market);
    $.forEach(responseJson).concat(responseJson);
    const marketDetail = {
        market: [responseJson],
        name: [],
        address: [],
        googlelink: [],
        products: [],
        schedule: [],
    }
}

/*function displayResults(results) {
    $('.searchResults').empty();
  
    for(let i=0; i < responseJson.results.length; i++){
      $('.searchResults').append(
        `<div class="cards">
        <h1>${responseJson.results[i].marketname}</h1></div`
      )};
      $('#js-results').removeClass('hidden');
      getDetails(marketIdArray);
}


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
});
