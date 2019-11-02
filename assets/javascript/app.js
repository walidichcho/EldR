$(document).ready(function() { 
    const obj = {
        nightlife : {
            name: "Hard Rock Cafe",
            title: "Dance-a-thon",
            date: "Friday, Dec. 30, 2019",
            address: "123 Brattle Street",
            city: "Boston",
            state: "MA",
            zip: "02851",
            phone: "617-555-1212", 
            website: "http://www.hardrock.com"  
        },
        dining : {
            name: "Shake Shack",
            title: "Free Shakes",
            date: "Wednesday, Nov. 30, 2019",
            address: "666 Mockingbird Lane",
            city: "Boston",
            state: "MA",
            zip: "02851",
            phone: "617-555-1212",
            website: "http://www.shackshack.com"   
        },
        fitness : {
            name: "Planet Fitness",
            title: "Sweating with the Oldies",
            date: "Tuesday, Dec. 6, 2019",
            address: "175 Northampton Street",
            city: "Boston",
            state: "MA",
            zip: "02851",
            phone: "617-555-1212",
            website: "http://www.planetfitness.com"
        },
        entertainment : {
            name: "Boston Common Theater",
            title: "Dance-a-thon",
            date: "Saturday, Jan. 15, 2020",
            address: "22 Tremont Street",
            city: "Boston",
            state: "MA",
            zip: "02851",
            phone: "617-555-1212",
            website: "http://www.loewstheaters.com"
        }
    }
    $(".user-selection").on("click", function(e) {
        e.preventDefault();
        let newEvent = $(this).val();
        console.log(obj[newEvent].name);
        // create table rows
        let newRow = $("<tr>");
            newRow.append('<td>' + obj[newEvent].date + "</td>");
            newRow.append('<td>' + obj[newEvent].name + "</td>");
            newRow.append('<td>' + obj[newEvent].title + "</td>");
            newRow.append('<td>' + obj[newEvent].city + ", " + obj[newEvent].state + " " + obj[newEvent].zip + "</td>");
            newRow.append('<td><a href="#">' + obj[newEvent].website + '</td><a href="#">');
        $("tbody").append(newRow);
    });
    });