
let gEarthKey = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD3tdqtnSKtnkY9nzGqjmUiPBbYGApjtvg&callback=initMap';

let map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }

$(initMap());
