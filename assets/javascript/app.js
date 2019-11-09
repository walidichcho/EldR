$(document).ready(function() { 

// create map variables
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

// setting today's date as the default search date
let startDate = moment().format('YYYY-MM-DD');
startDate = startDate.replace(/-/g, ""); // removes dashes for proper Eventful format

// click event for sidebar buttons
$(".user-selection").on("click", function (e) {
    // resets logitude and latitude variables
    center_long = 0;
    center_lat = 0;
    // clear the table
    $("#listings").html(" ");
    $("#map").html(" ");
    e.preventDefault();
    // if user select 
    newEvent = $(this).val();
    // if the user selects "events" initially we add "art" as the keyword search term, just to populate the table for the first time
    if (newEvent === "events") {
        newEvent = "art";
        // the events button controls the Eventful API so this function launches the Eventful API
        eventfulSelected(newEvent);
    }
    // if they choose one of the other 3 buttons it launches the Yelp API
    else {
        yelpSelected(newEvent);
    }

});

// this handles the filter click events
$("#submit-filter").on("click", function (e) {
    $("#image-holder").html("<img src='assets/images/loading.gif'>");


    // TODO: Use a setTimeout to run displayImage after 1 second.
    // setTimeout(displayImage, 1000);
    // clear the table
    $("#listings").html(" ");
    $("#map").html(" ");
    e.preventDefault();
    // update the variables with the value of the button clicked
    city = $("#city-list").val();
    newEvent = $("#category-list").val();
    startDate = $("#start-date").val();
    startDate = startDate.replace(/-/g, ""); // remove dashes for proper Eventful format
    keywords = $("#keywords").val();

    // create the Eventful API variable
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
        // Eventful returns a string so this turns it into an object
        response = JSON.parse(response);
        // launch the Eventful API
        eventfulList(response)
    });

});

// this is the Eventful function. I wasn't able to DRY it up because it's slightly different coming from the buttons vs. the filter
function eventfulSelected(newEvent) {
    
    // set the Eventful API variable. This helps with the CORS issue. We may be able to remove once we publish.
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
        // turning the Eventful string into an object
        response = JSON.parse(response);
        eventfulList(response)
    });

}

// this is the function for when someone selects Dining, Nightlife or Fitness
function yelpSelected(newEvent) {

    // Set the Yelp API variable. This helps with the CORS issue. We may be able to remove once we publish.
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

// this is the Yelp search function
function yelpList(data) {

    $(".heading").html("<h1>" + newEvent + " near you</h1>");
    let item = data.businesses;

      for (let i = 0; i<7; i++) {

            // updating the variables
            phone = item[i].display_phone;
            name = item[i].name;
            latitude = item[i].coordinates.latitude;
            longitude = item[i].coordinates.longitude;
            address = item[i].location.address1;
            city = item[i].location.city;
            state = item[i].location.state;
            zipcode = item[i].location.zip_code;
            // creating center point for map
            center_long = parseFloat(center_long);
            center_lat = parseFloat(center_lat);
            center_long += parseFloat(longitude);
            center_lat += parseFloat(latitude);

            // dynamic object created from API results
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

            // this does the math to create the latitude/longitude centerpoint 
            center_long = center_long/7;
            center_lat = center_lat/7;

            // this creates the object in the format that the map likes                
            let newStoresList = {
            "type": "FeaturedCollection",
            "features": storesDyn,
            "center_long": center_long,
            "center_lat": center_lat
        };
        // call the function that populates the map
        loadMap(newStoresList);
    
    }

    function eventfulList(data) {

        $(".heading").html("<h1>" + newEvent + " near you</h1>");
        let item = data.events;
        center_long = 0;
        center_lat = 0;

        for (let i = 0; i<7; i++) {

            phone = "<a href=" + item.event[i].venue_url + " target='blank'>Website</a>";
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

          let newStoresList = {
          "type": "FeaturedCollection",
          "features": storesDyn,
          "center_long": center_long, // this if we want a dynamic longitude based on search results
          "center_lat": center_lat  // this if we want a dynamic latitude based on search results
        };

        // call the load map function with the dynamic locations list
        loadMap(newStoresList);
    
    }

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// BELOW IS EVERYTHING HAVING TO DO WITH THE MAP FUNCTIONALITY //
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

function loadMap(newStoresList) {

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

  // enable map zoom controls
  // map.addControl(new mapboxgl.NavigationControl());

  // geolocation control
  // map.addControl(new mapboxgl.GeolocateControl({
  // positionOptions: {
  // enableHighAccuracy: true
  // },
  // trackUserLocation: true
  // }));

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
  // change the View
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
            currentFeature.properties.city + ', ' + currentFeature.properties.state + ' ' + currentFeature.properties.phone + '<h4>')
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

// this launches the map for the first time with defaul variables
yelpSelected(newEvent);

});