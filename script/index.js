'use strict';

const store = {
  parks:[],
};

const apiKey = 'F2pa5twbZ8tkdGUGfYNPZStQIbDwphiWGOMhckmS'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayParkInfo(responseJson){
  console.log('`displayParkInfo` ran');
  $('#results-list').empty();
  let googleMap = 'https://www.google.com/maps/place/';
  
  for(let i = 0; i< responseJson.data.length;i++){

    const address = responseJson.data[i].addresses[1];
    $('#results-list').append(`
    <li>
      <a target="_blank" href=${responseJson.data[i].url} ><h3 id = 'park-name'>${responseJson.data[i].name}</h3></a>
      <p id = 'park-description'>${responseJson.data[i].description}</p>
      <a target="_blank" href="${googleMap}+${address.line1}+${address.line2}+${address.city}+${address.stateCode}+${address.postalCode}"><p id = 'address'> Address: ${address.line1} ${address.line2} ${address.city} ${address.stateCode} ${address.postalCode}</p></a>
      <a target="_blank"href=${responseJson.data[i].url}>Website URL:${responseJson.data[i].url}</a>
    </li>
    `);
  }
  $('#results').removeClass('hidden');
  
}


function getParks(query,maxResults=10){
  const params = {
    api_key:apiKey,
    stateCode:query,
    limit:maxResults,
    fields:'addresses'
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log('test url',url);
  fetch(url)
    .then(response => {
      if(response.ok){
        return response.json();
      } throw new Error(response.statusText);
    })
    .then(responseJson => displayParkInfo(responseJson))
    .catch(error=>{
      $('js-error-message').text(`Something went wrong:${error.message}`);
    });
    
}





function formWatch(){
  console.log('`formWatch` ran');
  $('#results').addClass('hidden');
  $('form').on('submit',function(event){
    event.preventDefault();
    console.log('testing');
    let state = $('#js-search-state').val();
    let maxResult = $('#js-max-results').val();
    console.log('testing',state,maxResult);
    getParks(state,maxResult);
  });
}

function handler(){
  formWatch();
  
}
$(handler);
