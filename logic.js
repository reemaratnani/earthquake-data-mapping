
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  // console.log(data);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude:" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {

        var color;
        x = feature.properties.mag
        if(x > 0 && x <= 1) {
          color = "green";
        }
        else if (x > 1 && x <=2) {
          color = "greenyellow"
        }
        else if (x > 2 && x <=3) {
          color = "gold"
        }
        else if (x > 3 && x <=4) {
          color = "orange"
        }
        else if (x > 4 && x <=5) {
          color = "coral"
        }
        else {
          color ="red";
        }

      var geojsonMarker = {

        radius: 2.5*feature.properties.mag,

        fillColor: color,

        color: "black",

        weight: 1,

        opacity: 0.5,

        fillOpacity: 0.75

      };

      return L.circleMarker(latlng, geojsonMarker);

    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

//   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
//   });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
  layers: [streetmap, earthquakes]
});

  // Create a legend to display information about our map
  function getColor(m) {

    return m < 1 ? 'green' :

          m < 2  ? 'greenyellow' :

          m < 3  ? 'gold' :

          m < 4  ? 'orange' :

          m < 5  ? 'coral' :
                    'red';

}

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),

      grades = [0, 1, 2, 3, 4, 5],

      labels = [];

      div.innerHTML+='Magnitude<br><hr>'

  
      // loop through our magnitude intervals and generate a label with a colored square for each interval

      for (var i = 0; i < grades.length; i++) {

          div.innerHTML +=

              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +

              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

  }

  return div;

  };

  legend.addTo(myMap);





  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);
}
