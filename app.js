// Code Structure

// Define the url of the API call

// Perform a Get query on the API call and create a map

// Create a create map function

// Create a function to capture the necessary data such as magnitude, city, country, etc.

// Actual Start of Code

// Define the url of the API call

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a Get query on the API call and create a map

d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data.features);
});

// Function createMap

function createMap(earthquakeData) {

    // tile layers

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    // arrays to store data from earthquake

    var $lat = [];
    var $long = []
    var $mag = [];
    var $place = [];
    var $time = [];

    var earthquakeMarkers = [];

    // Icons for different earthquake intensity

    // var lightgreenCircle = new L.circle({
    //     stroke: false,
    //     fillOpacity: 0.6,
    //     fillColor: "lightgreen"
    //     radius: 

    // });

    // $data = earthquakes.properties;

    for (var i=0; i<earthquakeData.length; i++) {
        
            var $mag_data = earthquakeData[i]['properties']['mag'];
            var $place = earthquakeData[i]['properties']['place'];

            console.log("Magnitude: " + $mag_data);

            if ($mag_data < 1 ) {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "green",
                    radius: ($mag_data*10) + 10000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            } else if ($mag_data >= 1 && $mag_data < 2) {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "lightgreen",
                    radius: ($mag_data*10) + 20000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            } else if ($mag_data >= 2 && $mag_data < 3) {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "yellow",
                    radius: ($mag_data*10) + 50000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            } else if ($mag_data >= 3 && $mag_data < 4) {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "orange",
                    radius: ($mag_data*10) + 100000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            } else if ($mag_data >= 4 && $mag_data < 5) {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "darkorange",
                    radius: ($mag_data*10) + 150000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            } else {

                earthquakeMarkers.push(
                    L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
                    stroke: false,
                    fillOpacity: 0.6,
                    fillColor: "red",
                    radius: ($mag_data*10) + 10000
                    }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
                );


            }



    }


    // Define a baseMaps object to hold our base layers
    var earthquakes = L.layerGroup(earthquakeMarkers);
    
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [39.8097, -98.5556],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    // Layer control

    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);


};
