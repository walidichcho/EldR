$(document).ready(function() { 

let storesDyn = [];
let newEvent = "dining";
let phone;
let latitude;
let longitude;
let address;
let city = "Boston";
let keywords = "Italian";
let state;
let zipcode;
let name;
let center_long = 0;
let center_lat = 0;
let yelp = true;

let startDate = moment().format('YYYY-MM-DD');
console.log(startDate);
startDate = startDate.replace(/-/g, "");
console.log(startDate);

// $("#start-date").hide();

// $("#category-list").change(function(){
//     $("#start-date").hide();
//     let selection = $(this).val();
//     if (selection === "events"){
//       $("#start-date").show();
//     } 
//      else {
//         $("#start-date").hide(); 
//      }
//   });

$(".user-selection").on("click", function (e) {
    center_long = 0;
    center_lat = 0;
    $("#listings").html(" ");
    e.preventDefault();
    newEvent = $(this).val();
    if (newEvent === "entertainment") {
        newEvent = "art";
        eventfulSelected(newEvent);
    }
    else {
        yelpSelected(newEvent);
    }

});

$("#submit-filter").on("click", function (e) {
    $("#listings").html(" ");
    e.preventDefault();
    city = $("#city-list").val();
    newEvent = $("#category-list").val();
    startDate = $("#start-date").val();
    startDate = startDate.replace(/-/g, "");
    keywords = $("#keywords").val();

    console.log("new event" + newEvent)
    let apiEventful = "https://cors-anywhere.herokuapp.com/http://api.eventful.com/json/events/search?app_key=fQR9v8ZPXs3sbfJH&location=Boston&category=" + newEvent + "&date=" + startDate + "&keywords=" + keywords;

  $.ajax({
    url: apiEventful,
    method: "GET",
    headers: {
        "accept": "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer VqZqgUX2qboPwa-PUY_ZeLscFpp23iDTB7vFF4T6PKTfjFXNSOM8hpsoJmdnKeMGbXiYPmAuZLzGNVEkuUImrrICCSouTCpoALIBX7gaYV8-vDj_OvlCAbWpKsLAXXYx"
    },
}).then(function (response) {
    console.log(response);
    response = JSON.parse(response);
    console.log(response);
    eventfulList(response)
});

});


function eventfulSelected(newEvent) {
    console.log("new event" + newEvent)
    let apiEventful = "https://cors-anywhere.herokuapp.com/http://api.eventful.com/json/events/search?app_key=fQR9v8ZPXs3sbfJH&location=" + city + "&category=" + newEvent + "&date=" + startDate + "&keywords=" + keywords;

  $.ajax({
    url: apiEventful,
    method: "GET",
    headers: {
        "accept": "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "Bearer VqZqgUX2qboPwa-PUY_ZeLscFpp23iDTB7vFF4T6PKTfjFXNSOM8hpsoJmdnKeMGbXiYPmAuZLzGNVEkuUImrrICCSouTCpoALIBX7gaYV8-vDj_OvlCAbWpKsLAXXYx"
    },
}).then(function (response) {
    // console.log(response);
    response = JSON.parse(response);
    // console.log(response);
    eventfulList(response)
});

}

function yelpSelected(newEvent) {
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

    yelpList(response)
});

}


function yelpList(data) {


    let results = data.total
    let item = data.businesses;


      for (let i = 0; i<7; i++) {

            phone = item[i].display_phone;
            name = item[i].name;
            latitude = item[i].coordinates.latitude;
            longitude = item[i].coordinates.longitude;
            address = item[i].location.address1;
            city = item[i].location.city;
            state = item[i].location.state;
            zipcode = item[i].location.zip_code;
            center_long = parseFloat(center_long);
            center_lat = parseFloat(center_lat);
            center_long += parseFloat(longitude);
            center_lat += parseFloat(latitude);
            // console.log("long " + longitude);
            // console.log("centerlong " + center_long);
            // console.log("lat " + latitude);
            // console.log("centerlat " + center_lat);


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

            center_long = center_long/7;
            center_lat = center_lat/7;
            // console.log("center long " + center_long);
            // console.log("center lat " + center_lat);

          let newStoresList = {
          "type": "FeaturedCollection",
          "features": storesDyn,
          "center_long": center_long,
          "center_lat": center_lat
        };
        console.log("*********************");
        console.log(newStoresList);
        storesPass(newStoresList);
        console.log("*********************");
    
    }

    function eventfulList(data) {

        let item = data.events;
        center_long = 0;
        center_lat = 0;

        for (let i = 0; i<7; i++) {

            phone = "<a href=" + item.event[i].venue_url + ">Website</a>";
            name = item.event[i].title;
            latitude = item.event[i].latitude;
            longitude = item.event[i].longitude;
            address = item.event[i].venue_address;
            city = item.event[i].city_name;
            state = item.event[i].region_name;
            zipcode = item.event[i].postal_code;
            center_long = parseFloat(center_long);
            center_lat = parseFloat(center_lat);
            center_long += parseFloat(longitude);
            center_lat += parseFloat(latitude);
            console.log("long " + longitude);
            console.log("lat " + latitude);

              storesDyn[i] = {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        longitude,
                        latitude,
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
            center_long = center_long/7;
            center_lat = center_lat/7;
            console.log("center long " + center_long);
            console.log("center lat " + center_lat);


          let newStoresList = {
          "type": "FeaturedCollection",
          "features": storesDyn,
          "center_long": center_long,
          "center_lat": center_lat
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
  
  center_lat = center_lat.toString();
  center_long = center_long.toString();
  console.log("center lat " + center_lat);
  console.log("center long " + center_long);
  // This adds the map
  let map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/mapbox/light-v10',
    // initial position in [long, lat] format
    // center: [-71.0589, 42.3601],
    center: [center_long, center_lat],
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



yelpSelected(newEvent);

});