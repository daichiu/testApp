/**
 * Created by h205p2 on 5/24/17.
 */
var yemen = [];
var coordinates = [];

$(document).ready(function(){
    $.ajax({
        url: 'http://api.dronestre.am/data',
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function (result) {
            console.log(result);
            yem(result);
            myMap(result);

        },
        error: function () {
            alert('Failed!');
        }
    });
});

function yem(result){
    for(var i = 0; i<result.strike.length; i++){
        if(result.strike[i].country==="Yemen"){
            yemen.push(result.strike[i])
        }
    }
}

console.log(yemen);
console.log("Yemen Strikes");

//drone api returns a string, but google api must take number, so must parse
function latLng(lat, lng) {
    this.lat = parseFloat(lat);
    this.lng = parseFloat(lng);
}


function myMap(result) {
    var mapProp = {
        //lat and long of pakistan
        center:new google.maps.LatLng(15.5527, 48.5164),
        zoom: 5
    };
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    //get all the lat and lon coordinates into coordinates array
    for (var i = 0; i < yemen.length; i++) {
        var location = new latLng(yemen[i].lat, yemen[i].lon);
        //console.log(location);
        coordinates.push(location);
    }
    var markers = coordinates.map(function(location) {
        return new google.maps.Marker({
            map: map,
            position: location
        });
    });
    //attach the info text per drone strike
    for (var i = 0; i < markers.length; i++) {
        attachText(markers[i], yemen, i, map);
    }
    var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: "../clusters_images/marker"});
    //console.log("hi");

}

function attachText(marker, data, num, nameMap) {
    //var string = toString(data[num]);
    //console.log(Object.getOwnPropertyNames(data[num]));


    var string = "";
    string += "Number: "+data[num].number;
    string += "<br>";
    string += "Date: "+data[num].date;
    string += "<br>";
    string += "Deaths: "+data[num].deaths;
    string += "<br>";
    string += "Injuries: "+data[num].injuries;
    string += "<br>";
    string += "Town: "+data[num].town;
    string += "<br>";
    string += "Location: "+data[num].location;
    string += "<br>";
    string += "Narrative: " + data[num].narrative;
    string += "<br>";
    var infoWindow = new google.maps.InfoWindow({
        content: string
    });

    marker.addListener("click", function() {
        infoWindow.open(marker.get(nameMap), marker);
    });
}

//console.log(coordinates);
//console.log("coordinates array");
