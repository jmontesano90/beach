let geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
let geocodeApi = 'AIzaSyC3qDf_W5XE1_rxLvD6_JRZMZLQUxA_WxA';

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
      $('#weatherInfo').text(`Something went wrong: ${err.message}`);
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
        })
        
        .catch(err => {
          $('#weatherInfo').text(`Oh no we couldn't find that data!  Are you sure you picked somewhere near a beach?`);
        });;
}


function displayWeather(responseJson){
    console.log(responseJson);
    $('#weatherInfo').empty();
    $('.weatherReport').empty();
    $('.js-instructions').empty();
    $('p').removeClass('js-instructions');
    let d = new Date();
    let hour = d.getHours();
    let h = Number(hour);

    let airTempColor = tempColor(responseJson.hours[h].airTemperature[0].value);
    let waterTempColor = tempColor(responseJson.hours[h].waterTemperature[0].value);

    console.log(h);
    $('#weatherInfo').append(`
      <h3>Local Weather Conditions</h3>
        <ul class="weatherReport" id="weatherUl"> 
            <li class="waterTemperature" style="background-color: rgb(${waterTempColor[0]},${waterTempColor[1]},${waterTempColor[2]},${waterTempColor[3]});">Water Temperature: ${responseJson.hours[h].waterTemperature[0].value} °c</li>
            <li class="precipitation" style="background-color: rgb(10,198,255, ${precipitationTransparency(responseJson.hours[h].precipitation[0].value)});">Precipitation: ${responseJson.hours[h].precipitation[0].value} kg/m²</li>
            <li class="temperature" style="background-color: rgb(${airTempColor[0]},${airTempColor[1]},${airTempColor[2]},${airTempColor[3]});">Temperature: ${responseJson.hours[h].airTemperature[0].value} °c</li>
            <li class="waveHeight" style="background-color: rgb(66,45,255,${waveHeightTransparency(responseJson.hours[h].waveHeight[0].value)});">Wave Height: ${responseJson.hours[h].waveHeight[0].value} m</li>
            <li class="humidity" style="background-color: rgb(75,213,255, ${percentTransparency(responseJson.hours[h].humidity[0].value)});">Humidity: ${responseJson.hours[h].humidity[0].value} %</li>
            <li class="windSpeed" style="background-color: rgb(159,187,196,${windSpeedTransparency(responseJson.hours[h].windSpeed[0].value)});">Wind Speed: ${responseJson.hours[h].windSpeed[0].value} m/s</li>
            <li class="cloudCover" style="background-color: rgb(128,128,128, ${percentTransparency(responseJson.hours[h].cloudCover[0].value)});">Cloud Cover: ${responseJson.hours[h].cloudCover[0].value} %</li>
        </ul>`
    );
  let elmnt = document.getElementById("weatherUl");
  elmnt.scrollIntoView();

  }



  function precipitationTransparency(precip){
    let transparency = 1;
      if (precip >100){
        return transparency;
    }
      else{
        return precip/100;
    }
  }

  function windSpeedTransparency(speed){
    let transparency = 1;
      if (speed >100){
    return transparency;
  }
      else{
    return speed/100;
  }
}


  function waveHeightTransparency(waveHeight){
    console.log(waveHeight);
    let transparency = 1;
      if (waveHeight > 20){
        return transparency;
    }
      else{
        return waveHeight/20;
  }
}

  function percentTransparency(thing){
    return thing/100;
  }


  function tempColor(temp){
    console.log("temperature is " + temp);
    let transparencyValue;
    let tempHot = [255,85,85];
    let tempCold = [164,190,224];
    
    if (temp > 0){
        Math.abs(temp);
        transparencyValue = temp/100;
        tempHot.push(transparencyValue);
        return tempHot;
    }
    
    else{
      Math.abs(temp);
      transparencyValue = temp/100;
      tempCold.push(transparencyValue);
      return tempCold;
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


