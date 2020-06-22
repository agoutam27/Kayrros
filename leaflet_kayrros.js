
// Create the map
var map = L.map('map').setView([17.3850, 78.4867], 7);

// Set up the OSM layer
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15
  }).addTo(map);

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
  position: 'topleft',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    polyline: {
    	shapeOptions: {
        color: '#f357a1',
        weight: 10
          }
    },
    // disable toolbar item by setting it to false
    polyline: true,
    circle: true, // Turns off this drawing tool
    polygon: true,
    marker: true,
    rectangle: true,
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
  } else if ( type === 'polygon') {
  	layer.bindPopup('A polygon!');
  } else if (type === 'marker') 
  {layer.bindPopup('marker!');}
  else if (type === 'circle') 
  {layer.bindPopup('A circle!');}
   else if (type === 'rectangle') 
  {layer.bindPopup('A rectangle!');}


  editableLayers.addLayer(layer);
});