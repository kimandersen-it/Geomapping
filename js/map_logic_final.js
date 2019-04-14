// Create the tile layer that will be the background of the map

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 5,
  id: "mapbox.light",
  accessToken: API_KEY
});


// Initialize all of the LayerGroups
var layers = {
  ZERO: new L.LayerGroup(),
  ONE: new L.LayerGroup(),
  TWO: new L.LayerGroup(),
  THREE: new L.LayerGroup(),
  FOUR: new L.LayerGroup(),
  FIVE: new L.LayerGroup()
};

// Create the map with the layers
var map = L.map("map-id", {
  center: [39.931318, -97.134106],
  zoom: 10,
  layers: [
    layers.ZERO,
    layers.ONE,
    layers.TWO,
    layers.THREE,
    layers.FOUR,
    layers.FIVE
  ]
});

// Add the 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "0 - 1": layers.ZERO,
  "1 - 2": layers.ONE,
  "2 - 3": layers.TWO,
  "3 - 4": layers.THREE,
  "4 - 5": layers.FOUR,
  "5+": layers.FIVE
};

// Create a control for the layers, add the overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information 
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  ZERO: L.ExtraMarkers.icon({
    icon: "ion-ios-circle-filled",
    iconColor: "#40ff00",
    shape: "circle",
    extraClasses:"icon-level-0"
  }),
  ONE: L.ExtraMarkers.icon({
    icon: "ion-ios-circle-filled",
    iconColor: "#ffff00",
     shape: "circle",
    extraClasses:"icon-level-1",
  }),
  TWO: L.ExtraMarkers.icon({
    icon: "ion-ios-circle-filled",
    iconColor: "#FFD700",
    shape: "circle",
    extraClasses:"icon-level-2",
  }),
  THREE: L.ExtraMarkers.icon({
    icon: "ion-ios-circle-filled",
    iconColor: "#FFA500",
    shape: "circle",
    extraClasses:"icon-level-3",
  }),
  FOUR: L.ExtraMarkers.icon({
    icon: "ion-ios-circle-filled",
    iconColor: "#FF8C00",
    shape: "circle",
    extraClasses:"icon-level-4",
  }),
  FIVE: L.ExtraMarkers.icon({
      icon: "ion-ios-circle-filled",
      iconColor: "#FF4500",
      shape: "circle",
      extraClasses:"icon-level-5",

  })
};

// Perform an API call to the earthquake site
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(quakeInfo) {

   var quakeInfo = quakeInfo.features;
console.log(quakeInfo);
   // Create an object to keep of the number of markers in each layer
    var quakeCount = {
      ZERO: 0,
      ONE: 0,
      TWO: 0,
      THREE: 0,
      FOUR: 0,
      FIVE: 0
    };

    // Initialize code which will be used as a key to access the appropriate layers, icons, and eQuake count for layer group
    var quakeCode;

    // Loop through the quakes
    for (var i = 0; i < quakeInfo.length; i++) {

      // Create a new earthquake object with properties of both eQuake objects
    var eQuake = quakeInfo[i]; 

      console.log(quakeInfo[i].geometry.coordinates[0]);

      // Magnitude is < 1
      if (eQuake.properties.mag < 1) {
        quakeCode = "ZERO";
      }

      // ONE
      else if (eQuake.properties.mag >= 1 && eQuake.properties.mag < 2) {
        quakeCode = "ONE";
      }

      // TWO
      else if (eQuake.properties.mag >=2 && eQuake.properties.mag < 3)  {
        quakeCode = "TWO";
      }

      // THREE
      else if (eQuake.properties.mag >= 3 && eQuake.properties.mag < 4) {
        quakeCode = "THREE";
      }

      //FOUR
      else if (eQuake.properties.mag >= 4 && eQuake.properties.mag < 5) {
        quakeCode = "FOUR";
      }

      // FIVE
      else if (eQuake.properties.mag >=5) {
        quakeCode = "FIVE";
      }

      else {
        quakeCode = "NONE";
      }

      // Update the eQuake count
      quakeCount[quakeCode]++;

      // Create a new marker with the appropriate icon and coordinates

      var newMarker = L.marker([quakeInfo[i].geometry.coordinates[1],quakeInfo[i].geometry.coordinates[0]], {
          
         icon: icons[quakeCode]

      });


       console.log(newMarker);  

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[quakeCode]);
     
      newMarker.addTo(layers[quakeCode]);
      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup("Magnitude: " + eQuake.properties.mag + "<br>" + eQuake.properties.place + " Place");
    
    }

    //add the legend
    var ledgey= [0, 1, 2, 3, 4, 5];
    var colors = [
      "#40ff00",
      "#ffff00",
      "#FFD700",
      "#FFA500",
      "#FF8C00",
      "#FF4500"
    ];
    var legend = L.control({
      position: "bottomright"
    });
   
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
   for (var i = 0; i < ledgey.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp&nbsp</i> '   + 
        ledgey[i] + (ledgey[i + 1] ? "&ndash;" + ledgey[i + 1] + "<br>" : "+");
      }
      return div;
    };
   
    legend.addTo(map);

  });


 //Update the legend's innerHTML with the last updated time and eQuake count
function updateLegend(quakeCount) {
  document.querySelector(".legend").innerHTML = [
    "<p class='zero'>0 - 1: " + quakeCount.ZERO + "</p>",
    "<p class='one'>1 - 2: " + quakeCount.ONE + "</p>",
    "<p class='two'>2 - 3: " + quakeCount.TWO + "</p>",
    "<p class='three'>3 - 4: " + quakeCount.THREE + "</p>",
    "<p class='four'>4 - 5: " + quakeCount.FOUR + "</p>",
    "<p class='five'>5 + : " + quakeCount.FIVE + "</p>"
  ].join("");
}
