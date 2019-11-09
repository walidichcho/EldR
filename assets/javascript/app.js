$(document).ready(function () {

  // create universal variables
  let storesDyn = [];
  let newStoresList = {};
  let newEvent = "events";
  let phone;
  let url;
  let latitude;
  let longitude;
  let address;
  let city = "Boston";
  let keywords = "Italian";
  let state;
  let zipcode;
  let name;
  let sidebarLength;
  let center_long = 0;
  let center_lat = 0;

  // setting today's date as the default search date
  let startDate = moment().format('YYYY-MM-DD');
  startDate = startDate.replace(/-/g, ""); // removes dashes for proper Eventful format

  // hides date field
  $("#start-date").hide();

  // function to display date field based on category selection (don't need a date field for medical, fitness)
  $("#category-list").on("change", function () {
    console.log($(this).val());
    if ($(this).val() === "events") {
      $("#start-date").show();
    } else {
      $("#start-date").hide();
    }
  });

  // this handles the filter click events
  $("#submit-filter").on("click", function (e) {
    // clear the sidebar & map
    $("#listings").html(" ");
    $("#map").html(" ");
    e.preventDefault();

    // update the variables with the value of the button clicked
    city = $("#city-list").val();
    newEvent = $("#category-list").val();
    startDate = $("#start-date").val();
    startDate = startDate.replace(/-/g, ""); // remove dashes for proper Eventful format
    keywords = $("#keywords").val();

    if (newEvent === "fitness" || newEvent === "medical" || newEvent === "dining" || newEvent === "nightlife") {
      yelpSelected(newEvent, city);
    } else {
      eventfulSelected(newEvent, city)
    }

  });

  $.getJSON(
    "https://cors-anywhere.herokuapp.com/https://samples.openweathermap.org/data/2.5/weather?q=Orlando&appid=88f4f1113ee97cdfa2a6bab9f78f9382",
    function (data) {
      console.log(data);
      var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      // originalTemp is the temperature in Kelvin
      var originalTemp = data.main.temp;
      var weather = data.weather[0].main;
      // newTemp is the temperature in Fahrenheit
      var newTemp = (originalTemp * (9 / 5)) - 459.67;
      $(".icon").attr("src", icon);
      $(".weather").append(weather);
      $(".temp").append(newTemp.toFixed(0) + "&#176;F ");
    }
  );

  // this is the Eventful function. I wasn't able to DRY it up because it's slightly different coming from the buttons vs. the filter
  function eventfulSelected(newEvent, city) {

    // set the Eventful API variable. This helps with the CORS issue. We may be able to remove once we publish.
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
      // turning the Eventful string into an object
      response = JSON.parse(response);

      // handling edge case if search returns no results
      if (!response.events) {
        $("#listings").html("<h6>Sorry, no results matched your search. Here are some other great events happening near you!</h6>");
        // reset to dining and Boston just so some results are returned
        newEvent = "Events";
        city = "Boston";
        yelpSelected(newEvent, city);
      }
      // update sidebar title based on selection      
      $(".heading").html("<h1>" + newEvent + " near you</h1>");

      // shorten the API response
      let item = response.events;

      // reset the latitude and longitude variables
      center_long = 0;
      center_lat = 0;

      // handling results that are fewer than 7 but not 0
      if (item.event.length > 0 && item.event.length < 7) {
        sidebarLength = item.event.length;
      } else {
        sidebarLength = 7;
      }
      // looping through the API response object
      for (let i = 0; i < sidebarLength; i++) {
        url = "<a id='learn' href=" + item.event[i].venue_url + " target='blank'>Learn more</a>";
        name = item.event[i].title;
        latitude = item.event[i].latitude;
        longitude = item.event[i].longitude;
        address = item.event[i].venue_address;
        city = item.event[i].city_name;
        state = item.event[i].region_name;
        zipcode = item.event[i].postal_code;
        // creating variables for map's new center point
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
            "state": state,
            "url": url
          }
        }
      };
      // this does the math to create the latitude/longitude centerpoint 
      center_long = center_long / sidebarLength;
      center_lat = center_lat / sidebarLength;
      storesDyn = storesDyn.slice(0, sidebarLength);

      newStoresList = {
        "type": "FeaturedCollection",
        "features": storesDyn,
        "center_long": center_long, // this if we want a dynamic longitude based on search results
        "center_lat": center_lat // this if we want a dynamic latitude based on search results
      };

      loadMap(newStoresList);

    });

  }

  // this is the function for when someone selects Dining, Nightlife or Fitness
  function yelpSelected(newEvent, city) {

    // Set the Yelp API variable. This helps with the CORS issue. We may be able to remove once we publish.
    let apiYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + newEvent + "&location=" + city + ", MA&categories=" + keywords;

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

      // update sidebar title based on selection 
      $(".heading").html("<h1>" + newEvent + " near you</h1>");
      let item = response.businesses;
      // reset the latitude and longitude variables
      center_long = 0;
      center_lat = 0;

      // looping through the API response object
      for (let i = 0; i < 7; i++) {

        // updating the variables
        url = "<a id='learn' href=" + item[i].url + " target='blank'>Learn more</a>";
        name = item[i].name;
        latitude = item[i].coordinates.latitude;
        longitude = item[i].coordinates.longitude;
        address = item[i].location.address1;
        city = item[i].location.city;
        state = item[i].location.state;
        zipcode = item[i].location.zip_code;
        // creating variables for map's new center point
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
            "state": state,
            "url": url
          }
        }
      };
      // this does the math to create the latitude/longitude centerpoint 
      center_long = center_long / 7;
      center_lat = center_lat / 7;

      // this creates the object in the format that the map likes                
      newStoresList = {
        "type": "FeaturedCollection",
        "features": storesDyn,
        "center_long": center_long,
        "center_lat": center_lat
      };
      // call the function that populates the map
      // storesDyn = " ";
      loadMap(newStoresList);

    });

  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // BELOW IS EVERYTHING HAVING TO DO WITH THE MAP FUNCTIONALITY //
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  function loadMap(newStoresList) {

    // This will let you use the .remove() function later on
    if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function () {
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
      // center: [-71.0589, 42.3601],
      center: [center_long, center_lat],
      // initial zoom
      zoom: 11,
      scrollZoom: false
    });

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
    stores.features.forEach(function (marker, i) {
      // Create an img element for the marker
      let el = document.createElement('div');
      el.id = "marker-" + i;
      el.className = 'marker';
      // Add markers to the map at all points
      new mapboxgl.Marker(el, {
          offset: [0, -23]
        })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      el.addEventListener('click', function (e) {

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

      let popup = new mapboxgl.Popup({
          closeOnClick: false
        })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
          '<h4>' + currentFeature.properties.address + ' <br />' +
          currentFeature.properties.city + ', ' + currentFeature.properties.state + ' ' + currentFeature.properties.url + '<h4>')
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
        // link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = prop.name;

        let addressDeets = listing.appendChild(document.createElement('div'));
        addressDeets.innerHTML = prop.address;

        let details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop.city;
        if (prop.url) {
          details.innerHTML += ' &middot; ' + prop.url;
        }

        link.addEventListener('click', function (e) {
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
  yelpSelected(newEvent, city);

});