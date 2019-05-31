//Download the earthquake data 

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

// Download the tectonic plates data and create the overlay map for the tectonic plates 
var datalink = "/data/PB2002_boundaries.json";

var overlayMaps = {};
d3.json(datalink, function(data) {
  var plates = L.geoJson(data);
  overlayMaps = {
    "Tectonic Plates": plates
  };
});

function createFeatures(earthquakeData) {

  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
  };

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  //opacity on logarithmic scale because most earthquakes are within 1 Richter scale
  //Size still on regular scale - logarithmic will colour map red with one strong earthquake
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
            stroke: false,
            fillOpacity: 0.00001*Math.pow(10, feature.properties.mag),
            color: "red",
            fillColor: "red", 
            radius: feature.properties.mag*3,
        });
      },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

  
// Create the Map

function createMap(earthquakes) {

    // Create the basic map layer   
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });


    // Create a baseMaps object
    var baseMaps = {
        "Dark Map": darkmap,
        "Light Map": lightmap
    };

// Add to the overlay object
    overlayMaps.Earthquakes = earthquakes;
// Define a map object
  var sanFranCoords = [37.77, -122.42];
  var mapZoomLevel = 6;

  var map = L.map("map-id", {
      center: sanFranCoords,
      zoom: mapZoomLevel,
      layers: [lightmap, earthquakes]
    });
  

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}
