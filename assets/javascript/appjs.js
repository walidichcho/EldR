$(document).ready(function () {

    $(".user-selection").on("click", function (e) {
        e.preventDefault();
        let newEvent = $(this).val();
        
        let apiYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + newEvent + "&location=Boston"

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
            let results = response.total
            console.log(response);
            if (results > 0) {
                $.each(response.businesses, function (i, item) {
                    // Store each business's object in a variable
                    let id = item.id;
                    let alias = item.alias;
                    let phone = item.display_phone;
                    let image = item.image_url;
                    let name = item.name;
                    let rating = item.rating;
                    let reviewcount = item.review_count;
                    let latitude = item.coordinates.latitude;
                    let longitude = item.coordinates.longitude;
                    let address = item.location.address1;
                    let city = item.location.city;
                    let state = item.location.state;
                    let zipcode = item.location.zip_code;
                    let newRow = $("<tr>");
                    newRow.append("<td>" + name + "</td>");
                    newRow.append("<td>" + address + "</td>");
                    newRow.append("<td>" + city + "</td>");
                    newRow.append("<td>" + state + "</td>");
                    newRow.append("<td>" + zipcode + "</td>");
                    newRow.append("<td>" + phone + "</td>");
                    newRow.append("<td>" + rating + "</td>");
                    newRow.append("<td>" + reviewcount + "</td>");
                    newRow.append("<td>" + latitude + "</td>");
                    $("tbody").append(newRow);
                });
            }
    
        });
    });



});