
let gEarthKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD3tdqtnSKtnkY9nzGqjmUiPBbYGApjtvg&callback=initMap';

let map;

function initMap() {
        console.log("google api worked");
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
  }

function checkWeather(){
    const lat = -34.397;
    const lng = 150.644;
    const params = 'waveHeight,airTemperature,precipitation,waterTemperature';
      
fetch(`https://api.stormglass.io/v1/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
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

    $('#weatherInfo').append(`
        <ul class="weatherReport"> 
            <li>Water Temperature:${responseJson.hours[0].waterTemperature[0].value}</li>
            <li>Precipitation:${responseJson.hours[0].precipitation[0].value}</li>
            <li>Temperature:${responseJson.hours[0].airTemperature[0].value}</li>
            <li>Wave Height:${responseJson.hours[0].waveHeight[0].value}</li>
        </ul>`
    );
}



$(checkWeather);
$(initMap);
