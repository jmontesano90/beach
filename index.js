
let gEarthKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD3tdqtnSKtnkY9nzGqjmUiPBbYGApjtvg&callback=initMap';
let placesApi = 'AIzaSyD3tdqtnSKtnkY9nzGqjmUiPBbYGApjtvg';
let placesUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
let geocodeApi = 'AIzaSyC3qDf_W5XE1_rxLvD6_JRZMZLQUxA_WxA';

// function getCoords(location){
//     //this getCoords run off of google places
//     const params = {
//         input: location,
//         inputtype: 'textquery',
//         fields: 'geometry',
//         key: placesApi,
//     };

//     const queryString = formatQueryParams(params);
//     const url = placesUrl + '?' + queryString;
//     console.log(url);

//     fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     // .then(responseJson => refreshMap(responseJson))
//     .catch(err => {
//       $('#js-error-message').text(`Something went wrong: ${err.message}`);
//     });

// }

function getCoords(location){

      const params = {
        address: location,
        key: geocodeApi,
    };

     const queryString = formatQueryParams(params);
     const url = geocodeUrl + '?' + queryString;
    console.log(url);

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => refreshPage(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });


}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

let map;
function initMap() {
        console.log("google api worked");
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
  }

  function refreshPage(responseJson){
        $('#map').empty();
        console.log("refresh map ran");
        lat = responseJson.results[0].geometry.location.lat;
        long = responseJson.results[0].geometry.location.lng;
        console.log(lat);
        console.log(long);
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: long},
            zoom: 14
        });

        $(checkWeather(lat, long));    
  }

function checkWeather(lat, long){
    const params = 'waveHeight,airTemperature,precipitation,waterTemperature,humidity,windSpeed,cloudCover';
      
    fetch(`https://api.stormglass.io/v1/weather/point?lat=${lat}&lng=${long}&params=${params}`, {
        headers: {
            'Authorization': '23da59d0-1153-11ea-afc0-0242ac130002-23da5ad4-1153-11ea-afc0-0242ac130002'
      }
    })
        .then((response) => 
            response.json()).then((jsonData) => {
             console.log("weather api worked");
             displayWeather(jsonData);
        });
}


function displayWeather(responseJson){
    console.log(responseJson);
    $('#weatherInfo').empty();
    $('.weatherReport').empty();
    styleResults(responseJson.hours[0].airTemperature[0].value,responseJson.hours[0].waterTemperature[0].value,responseJson.hours[0].precipitation[0].value,responseJson.hours[0].cloudCover[0].value,responseJson.hours[0].humidity[0].value,responseJson.hours[0].windSpeed[0].value,responseJson.hours[0].waveHeight[0].value);
    $('#weatherInfo').append(`
      <h3>Local Weather Conditions</h3>
        <ul class="weatherReport"> 
            <li class="waterTemperature">Water Temperature: ${responseJson.hours[0].waterTemperature[0].value} °c</li>
            <li class="precipitation">Precipitation: ${responseJson.hours[0].precipitation[0].value} kg/m²</li>
            <li class="temperature">Temperature: ${responseJson.hours[0].airTemperature[0].value} °c</li>
            <li class="waveHeight">Wave Height: ${responseJson.hours[0].waveHeight[0].value} m</li>
            <li class="humidity">Humidity: ${responseJson.hours[0].humidity[0].value} %</li>
            <li class="windSpeed">Wind Speed: ${responseJson.hours[0].windSpeed[0].value} m/s</li>
            <li class="cloudCover">Cloud Cover: ${responseJson.hours[0].cloudCover[0].value} %</li>
        </ul>`
    );
}


// $(getCoords("Gardiner County Park"));
// $(checkWeather);
// $(initMap);

function styleResults(temperature,waterTemperature,precipitation,cloudCover,humidity,windSpeed,waveHeight){
    console.log(temperature,waterTemperature,precipitation,cloudCover,humidity);

    let params = [
      {
        class: ".precipitation",
        color1: 10,
        color2: 198,
        color3: 255,
        transparency: precipitation/100
      },

      {
        class: ".humidity",
        color1: 75,
        color2: 213,
        color3: 255,
        transparency: humidity/100
      },

      {
        class: ".waveHeight",
        color1: 66,
        color2: 45,
        color3: 255,
        transparency: waveHeight/20
      },
      
      {
        class: ".cloudCover",
        color1: 128,
        color2: 128,
        color3: 128,
        transparency: cloudCover/100
      },

      {
        class: ".windSpeed",
        color1: 159,
        color2: 187,
        color3: 196,
        transparency: windSpeed/100
      },

    ];
    
    for (i = 0; i < params.length; i++){
    let style = document.createElement('style');
      style.innerHTML = `
        ${params[i].class} {
         background-color: rgba(${params[i].color1},${params[i].color2}, ${params[i].color3},${params[i].transparency});
       }
     `;
     console.log(params[i].class);
    document.head.appendChild(style);
    }

    let temp="temperature";
    let watertemp="waterTemperature";

    tempColor(temperature,temp);
    tempColor(waterTemperature,watertemp);
  }

  function tempColor(temperature,tempType){
    let transparencyValue;
    
    if (temperature > 0){
        transparencyValue = temperature/100;
        let tempStyle = document.createElement('style');
        tempStyle.innerHTML = `
          .${tempType} {
          background-color: rgba(255, 85, 85,${transparencyValue});
          }
          `;
    document.head.appendChild(tempStyle);
    }
    else {
       Math.abs(temperature);
       transparencyValue = temperature/100;
       let tempStyle = document.createElement('style');
       tempStyle.innerHTML = `
         .${tempType} {
         background-color: rgba(164, 190, 224,${transparencyValue});
         }
         `;
   document.head.appendChild(tempStyle);

    }

  }

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const searchTerm = $('#js-search-term').val();
      getCoords(searchTerm);
    });
  }
  
  $(watchForm);


