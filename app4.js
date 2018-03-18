// Bonus js codes - heat map

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

    var heatArray = [];

    // Tectonic Data style
    
    var tectonicLines = {

        "color": "orange",
        "weight": 2,
        "fillColor": "#000",
        "opacity": 1,
        "fillOpacity": 0
    }

    tectonicData = L.geoJSON(tectonicData, {style: tectonicLines});
   
    for (var i=0; i<earthquakeData.length; i++) {
        
        // var $mag_data = earthquakeData[i]['properties']['mag'];
        // var $place = earthquakeData[i]['properties']['place'];

        // console.log("Magnitude: " + $mag_data);

        heatArray.push([earthquakeData[i]['geometry']['coordinates'][1], earthquakeData[i]['geometry']['coordinates'][0]])
        
    }    

    var heatLayerMap  =  L.heatLayer(heatArray, {
        radius: 25,
        blur: 15,
        minOpacity: 10

    });

    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: heatLayerMap,
        "Fault Lines": tectonicData
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [39.8097, -98.5556],
        zoom: 5,
        layers: [darkmap, heatLayerMap, tectonicData]
    });

    // Layer control

    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

    // function for Color

    // function getColor(d) {
    //     return  d < 1 ? 'green':
    //             d < 2 ? 'lightgreen':
    //             d < 3 ? 'yellow':
    //             d < 4 ? 'orange':
    //             d < 5 ? 'darkorange':
    //                      'red';
    // }


    // // Build a legend
    // var legend = L.control({position: 'bottomright'});

    // legend.onAdd = function (map) {

    //     // Creates a div with class="info legend"
        
    //     var div = L.DomUtil.create('div', 'info legend'),
    //         mag = [0, 1, 2, 3, 4, 5],
    //         labels = [];
        
    //     console.log(mag);

    //     // Sets the html code inside the div
        
    //     for (var i = 0; i<mag.length; i++) {
    //         div.innerHTML +=
    //         '<i style="background:' + getColor(mag[i]) + '"></i> ' +
    //             mag[i] + (mag[i+1] ? '&ndash;' + mag[i+1] + '<br>' : '+');

    //     }

    //     return div;
    // };

    // legend.addTo(myMap);

};
