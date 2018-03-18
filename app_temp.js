var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data.features);
});

// function createFeatures(earthquakeData) {
    
//     var earthquakes = L.geoJSON(earthquakeData);
//     // Sending our earthquakes layer to the createMap function
//     createMap(earthquakes);
// }

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");
    
    var getInterval = function(earthquakes) {
        // earthquake data only has a time, so we'll use that as a "start"
        // and the "end" will be that + some value based on magnitude
        // 18000000 = 30 minutes, so a quake of magnitude 5 would show on the
        // map for 150 minutes or 2.5 hours
        return {
          start: earthquakes.properties.time,

          end:   earthquakes.properties.time + earthquakes.properties.mag * 1800000
        };
      };

    var timelineControl = L.timelineSliderControl({
        formatOutput: function(date) {
          return new Date(date).toString();
        }
    });

    var timeline = L.timeline(earthquakes);

    // var timeline = L.timeline(earthquakes, {
    //     getInterval: getInterval,
    //     pointToLayer: function(earthquakes, latlng){
    //       var hue_min = 120;
    //       var hue_max = 0;
    //       var hue = earthquakes.properties.mag / 10 * (hue_max - hue_min) + hue_min;
    //       return L.circle([earthquakes.geometry.coordinates[1], earthquakes.geometry.coordinates[0]], {
    //         radius: earthquakes.properties.mag * 3,
    //         color: "hsl("+hue+", 100%, 50%)",
    //         fillColor: "hsl("+hue+", 100%, 50%)"
    //       }).bindPopup('<a href="'+earthquakes.properties.url+'">click for more info</a>');
    //     }
    // });

    // this is just used to show the currently-displayed earthquakes
      // in the little sidebar. meant as an example of a use for the 'change'
      // event
    // function updateList(timeline){
    //     var displayed = timeline.getLayers();
    //     var list = document.getElementById('displayed-list');
    //     list.innerHTML = "";
    //     displayed.forEach(function(quake){
    //       var li = document.createElement('li');
    //       li.innerHTML = quake.feature.properties.title;
    //       list.appendChild(li);
    //     });
    // }
    


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: timeline
    };
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

    timelineControl.addTo(myMap);
    timelineControl.addTimelines(timeline);
    timeline.addTo(myMap);
    timeline.on('change', function(e){
          updateList(e.target);
        });
    updateList(timeline);

}