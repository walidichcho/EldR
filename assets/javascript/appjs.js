$(document).ready(function () {

    $(".user-selection").on("click", function (e) {
        e.preventDefault();
        let newEvent = $(this).val();

        let apiEventful = {
            "async": true,
            "crossDomain": true,
            "url": "https://community-official-world-cup.p.rapidapi.com/wc/matches",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "community-official-world-cup.p.rapidapi.com",
                "x-rapidapi-key": "74744b3964msh9127df7e40e8745p1a94f6jsn609e28ab4ecb"
            }
        }
        $.ajax(apiEventful).then(function (response) {
            console.log(response);
            //let results = response

        });
    });

    //create table rows

    //let newRow = $("<tr>");
    //newRow.append('<td>' + results.start_time + "</td>");
    // newRow.append('<td>' + obj[newEvent].name + "</td>");
    // newRow.append('<td>' + obj[newEvent].title + "</td>");
    // newRow.append('<td>' + obj[newEvent].city + ", " + obj[newEvent].state + " " + obj[newEvent].zip + "</td>");
    // newRow.append('<td><a href="#">' + obj[newEvent].website + '</td><a href="#">');
    // $("tbody").append(newRow);

});