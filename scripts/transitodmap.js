// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

var transitmap = new L.Map("transitodmap", {
    zoomControl: false,
    center: new L.LatLng(lat, long),
    zoom: 7
});

var center = new L.LatLng(lat, long);

function zoomTo(location, map) {
	map.setView(location, 8);
	}

// display correctly on tab load
$("a[href='#7']").on('shown.bs.tab',function(e) {
    transitmap.invalidateSize();
});

// basemap
var baselayer3 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v10',
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
})

transitmap.addLayer(baselayer3);

// interactions
function highlightFeatureintro(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0,
    }); }

function resetHighlightintro(e) {
    var layer = e.target;

    layer.setStyle(
       countystyle(layer.feature)
    );
    }

// styles


// assemble layers
var transitg = L.geoJSON(transitgeo, {
    style: {
        color: "#233D4D",
        fillOpacity: 0,
        weight: 1
    },
    interactive: false
}).addTo(transitmap);

var cmap2 = L.geoJSON(cmaparea, {
    style: {
        color: "blue",
        fillOpacity: 0.1,
        weight: 0
    },
    interactive: false
}).addTo(transitmap);
