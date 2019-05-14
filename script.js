'use strict'

//get Market Names and ID's
function formatQueryParameters(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)

    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);

    $('.searchResults').empty();
  
    for(let i=0; i < responseJson.results.length; i++){
      $('.searchResults').append(
        `<div class="cards">
        <h1>${responseJson.results[i].marketname}</h1></div`
      )};
      $('#js-results').removeClass('hidden');
      let marketID = responseJson.results[i].id;
      getDetails(responseJson);
  }
  
  function getDetails(marketID) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service mktDetail.
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + marketId,
        dataType: 'jsonp',
        jsonpCallback: 'detailResultHandler'
    });
}
function getResults(zipCode) {
    console.log(zipCode);
    const searchURL = 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch';

    const params = {
        zip: zipCode,
    }

    console.log(params);

    const queryString = formatQueryParameters(params);
    const url =  searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error (response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const zipCode= $('#js-zipCode').val();
        console.log(zipCode);
        getResults(zipCode)
    })
}

$(function(){
    console.log('App loaded! Waiting for submit!');
    watchForm();
});
