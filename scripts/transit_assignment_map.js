// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

var transit_map = new L.Map("transit_map", {
    zoomControl: false,
    center: new L.LatLng(41.8781, -87.6298),
    zoom: 9
});

var baselayer3 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
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
  