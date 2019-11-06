$(document).ready(function() { 

let storesDyn = [];
let newEvent = "dining";
let phone;
let latitude;
let longitude;
let address;
let city;;
let state;
let zipcode;
let name;

$(".user-selection").on("click", function (e) {
    $("#listings").html(" ");
    // $(".map").clear();
    e.preventDefault();
    let newEvent = $(this).val();
    firstLoad(newEvent);

});

function firstLoad(newEvent) {
    console.log("new event" + newEvent)
    // TA questions cors-anywhere.herokuapp.com
    let apiYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + newEvent + "&location=Boston";

  $.ajax({
    url: apiYelp,
    method: "GET",
    headers: {
        "accept": "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer VqZqgUX2qboPwa-PUY_ZeLscFpp23iDTB7vFF4T6PKTfjFXNSOM8hpsoJmdnKeMGbXiYPmAuZLzGNVEkuUImrrICCSouTCpoALIBX7gaYV8-vDj_OvlCAbWpKsLAXXYx"
    },
}).then(function (response) {
    console.log(response);

    loadMap(response)
});

}

function loadMap(e) {
    let results = e.total
    let item = e.businesses;

    if (results > 0) {

      for (let i = 0; i<7; i++) {

            phone = item[i].display_phone;
            console.log(phone);
            name = item[i].name;
            console.log(name);
            latitude = item[i].coordinates.latitude;
            console.log(latitude);
            longitude = item[i].coordinates.longitude;
            console.log(longitude);
            address = item[i].location.address1;
            console.log(address);
            city = item[i].location.city;
            console.log(city);
            state = item[i].location.state;
            console.log(state);
            zipcode = item[i].location.zip_code;

              storesDyn[i] = {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        longitude,
                        latitude
                      ]
                    },
                    "properties": {
                      "name": name,
                      "phoneFormatted": phone,
                      "phone": phone,
                      "address": address,
                      "city": city,
                      "country": "United States",
                      "crossStreet": " ",
                      "postalCode": zipcode,
                      "state": state
                    }
                  }
            };

          let newStoresList = {
          "type": "FeaturedCollection",
          "features": storesDyn
        };
        console.log("*********************");
        console.log(newStoresList);
        storesPass(newStoresList);
        console.log("*********************");
    }



function storesPass(newStoresList) {
console.log("....................");
console.log(newStoresList);
console.log("....................");

  // This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRzaGF1Y2siLCJhIjoiY2syZjU4eWFjMGdvbjNvbW8wN3NjZTJxaSJ9.ZHwNa6cWqC0ZdkAKX6YYCQ';

  // This adds the map
  let map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/mapbox/light-v10',
    // initial position in [long, lat] format
    center: [-71.0589, 42.3601],
    // initial zoom
    zoom: 11,
    scrollZoom: true
  });

    // driving directions
    // map.addControl(new MapboxDirections({
    //   accessToken: mapboxgl.accessToken
    //   }), 'top-left');

  // enable map zoom controls
  map.addControl(new mapboxgl.NavigationControl());

  // geolocation control
  map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  trackUserLocation: true
  }));

// dynamic list of stores 
stores = newStoresList;

  // This adds the data to the map
  map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
      "type": "geojson",
      "data": stores
    });
    // Initialize the list
    buildLocationList(stores);

  });

  // This is where your interactions with the symbol layer used to be
  // Now you have interactions with DOM markers instead
  stores.features.forEach(function(marker, i) {
    // Create an img element for the marker
    let el = document.createElement('div');
    el.id = "marker-" + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el, {offset: [0, -23]})
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    el.addEventListener('click', function(e){
        // 1. Fly to the point
        flyToStore(marker);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        let activeItem = document.getElementsByClassName('active');

        e.stopPropagation();
        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }

        let listing = document.getElementById('listing-' + i);
        listing.classList.add('active');

    });
  });


  function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
      });
  }

  function createPopUp(currentFeature) {
    let popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();


    let popup = new mapboxgl.Popup({closeOnClick: false})
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
            '<h4>' + currentFeature.properties.address + ' <br />' +
            currentFeature.properties.city + ', ' + currentFeature.properties.state + ' ' + currentFeature.properties.postalCode + '<h4>')
          .addTo(map);
  }

  function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
      let currentFeature = data.features[i];
      let prop = currentFeature.properties;

      let listings = document.getElementById('listings');
      let listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = "listing-" + i;

      let link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.dataPosition = i;
      link.innerHTML = prop.name;

      let addressDeets = listing.appendChild(document.createElement('div'));
      addressDeets.innerHTML = prop.address;

      let details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.city;
      if (prop.phone) {
        details.innerHTML += ' &middot; ' + prop.phoneFormatted;
      }

      link.addEventListener('click', function(e){
        // Update the currentFeature to the store associated with the clicked link
        let clickedListing = data.features[this.dataPosition];

        // 1. Fly to the point
        flyToStore(clickedListing);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedListing);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        let activeItem = document.getElementsByClassName('active');

        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');

      });
    }
  }
};

}

firstLoad(newEvent);

});