// Code Structure

// Define the url of the API call

// Perform a Get query on the API call and create a map

// Create a create map function

// Create a function to capture the necessary data such as magnitude, city, country, etc.

// Actual Start of Code

// Define the url of the API call

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicJSON = "PB2002_plates.json";

// Perform a Get query on the API call and create a map

d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    
    d3.json(tectonicJSON, function(tectonic_data) {

        createMap(data.features, tectonic_data.features);

    });

    
});

// function to update the list on the side bar



// Function createMap

function createMap(earthquakeData, tectonicData) {

    // tile layers

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

    // arrays to store data from earthquake

    var $lat = [];
    var $long = []
    var $mag = [];
    var $place = [];
    var $time = [];

    var earthquakeMarkers = [];

    // Tectonic Data style
    
    var tectonicLines = {

        "color": "orange",
        "weight": 2,
        "fillColor": "#000",
        "opacity": 1,
        "fillOpacity": 0
    }

    tectonicData = L.geoJSON(tectonicData, {style: tectonicLines});
   
    var getInterval = function(earthquakeData) {

        return {
            start: earthquakeData.properties.time,
            end: earthquakeData.properties.time + earthquakeData.properties.mag * 1800000
        };
    };

    var timelineControl = L.TimelineSliderControl({
        formatOutput: function(date) {
            return new Date(date).toString();
        }
    });

    function updateList(timeline){
        var displayed = timeline.getLayers();
        var list = document.getElementById('displayed-list');
        list.innerHTML = "";
        displayed.forEach(function(quake){
          var li = document.createElement('li');
          li.innerHTML = quake.feature.properties.title;
          list.appendChild(li);
        });
      }
    

    var timeline = L.Timeline(earthquakeData, {
        getInterval: getInterval,
        pointToLayer: function(earthquakeData, latlng) {
            var hue_min = 120;
            var hue_max = 0;

            console.log(earthquakeData);

            var hue = earthquakeData.properties.mag / 10 * (hue_max - hue_min) + hue_min;
            return L.circle(latlng, {
                radius: earthquakeData.properties.mag * 3,
                color: "hsl("+hue+", 100%, 50%)",
                fillColor: "hsl("+hue+", 100%, 50%)"
            }).bindPopup('<a href="'+earthquakeData.properties.url+'">click for more info</a>');
        }
    });

    
    timelineControl.addTo(myMap);
    timelineControl.addTimelines(timeline);
    timeline.addTo(myMap);
    timeline.on('change', function(e) {
        updateList(e.target);
    });
    updateList(timeline);



    // for (var i=0; i<earthquakeData.length; i++) {
        
    //         var $mag_data = earthquakeData[i]['properties']['mag'];
    //         var $place = earthquakeData[i]['properties']['place'];

    //         // console.log("Magnitude: " + $mag_data);

    //         if ($mag_data < 1 ) {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "green",
    //                 radius: ($mag_data*10) + 10000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         } else if ($mag_data >= 1 && $mag_data < 2) {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "lightgreen",
    //                 radius: ($mag_data*10) + 20000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         } else if ($mag_data >= 2 && $mag_data < 3) {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "yellow",
    //                 radius: ($mag_data*10) + 50000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         } else if ($mag_data >= 3 && $mag_data < 4) {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "orange",
    //                 radius: ($mag_data*10) + 100000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         } else if ($mag_data >= 4 && $mag_data < 5) {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "darkorange",
    //                 radius: ($mag_data*10) + 150000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         } else {

    //             earthquakeMarkers.push(
    //                 L.circle([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]], {
    //                 stroke: false,
    //                 fillOpacity: 0.6,
    //                 fillColor: "red",
    //                 radius: ($mag_data*10) + 10000
    //                 }).bindPopup("<h3>Place: " + $place + "<h3><h3> Magnitude: " + $mag_data + "<h3>")
    //             );


    //         }



    // }


    // Define a baseMaps object to hold our base layers
    var earthquakes = L.layerGroup(earthquakeMarkers);
    
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Fault Lines": tectonicData
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [39.8097, -98.5556],
        zoom: 5,
        layers: [darkmap, earthquakes, tectonicData]
    });

    // Layer control

    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

    // function for Color

    function getColor(d) {
        return  d < 1 ? 'green':
                d < 2 ? 'lightgreen':
                d < 3 ? 'yellow':
                d < 4 ? 'orange':
                d < 5 ? 'darkorange':
                         'red';
    }


    // Build a legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        // Creates a div with class="info legend"
        
        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5],
            labels = [];
        
        console.log(mag);

        // Sets the html code inside the div
        
        for (var i = 0; i<mag.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(mag[i]) + '"></i> ' +
                mag[i] + (mag[i+1] ? '&ndash;' + mag[i+1] + '<br>' : '+');

        }

        return div;
    };

    legend.addTo(myMap);

};
