// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';
var lat= 41.8781;
var long = -87.9298;
var center = new L.LatLng(lat, long);
function zoomTo(location, map) {
  map.setView(location, 9);
  }

var transit_map = new L.Map("transit_map", {
    zoomControl: false,
    center: new L.LatLng(41.8781, -87.6298),
    zoom: 9
});

var baselayer3 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v10',
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
})

$("a[href='#9']").on('shown.bs.tab',function(e) {
    transit_map.invalidateSize();
});
transit_map.addLayer(baselayer3);


var metra1 = L.geoJson(metradata, {
    color: '#696969',
    opacity: 0.8,
    weight: 2,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.LINES),
        layer.LINE = feature.properties.LINES.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "");
    }
});

var cta1 = L.geoJson(ctalines, {
    color: "black",
    opacity: 0.8,
    weight: 2,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.LINES),
        layer.LINE = feature.properties.LINES.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "");
    }
});

metra1.addTo(transit_map);
cta1.addTo(transit_map);
