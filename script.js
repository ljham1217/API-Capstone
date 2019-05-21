'use strict'
//watch for zipCode submission

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const zipCode= $('#js-zipCode').val();
            /*Promise.all(getResults(zipCode), getDetails());
                promises.then(function(results) {
                    console.log(results);
                } );*/
            getResults(zipCode);
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
    .then(idResponseJson => makeIdArray(idResponseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}


function makeIdArray(idResponseJson) {
    console.log(idResponseJson);
    const idArray= [];    
    $.each(idResponseJson.results, function (i, val) {
        idArray.push(idResponseJson.results[i].id);
    });
        console.log(idArray);
        //displayResults(idResponseJson);//passing the original Array as it contains the market name
        getDetails(idArray);  
        displayResults(idResponseJson); 
}

const fetchData = function() {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}

function getDetails(idArray) {
    const marketsArray = []; 
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
    console.log(marketsArray);
}

function displayResults(idResponseJson) {
    console.log(idResponseJson);
    let counter= 0;
    $('.searchResults').empty();
    for(let i=0; i < idResponseJson.results.length; i++){
                $('.searchResults').append(
                    `<div class="cards" id="${counter}">
                    <h1>${idResponseJson.results[i].marketname}</h1>                
                    </div>`
                );
    }
      $('#js-results').removeClass('hidden');
}

function displayDetails(marketsArray) {
    for(let i=0; i < marketsArray.length; i++){
        $('cards').find('${i}').text("${marketsArray[i].marketdetails.Address}") }
    console.log('can I log the paragraph?')
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
