// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

var regionmap = new L.Map("regionmap", {
    zoomControl: false,
    center: new L.LatLng(41.8781, -87.8298),
    zoom: 8
});

var regionbaselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.streets',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

$("a[href='#1']").on('shown.bs.tab',function(e) {
    regionmap.invalidateSize();
});
regionmap.addLayer(regionbaselayer);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
    }); }

function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle(
        mhnstyle(layer.feature)
    );
    }

function countystyle(feature) {
    return {
    weight: 2,
    fillOpacity: 0,
    color: 'grey',
    fillColor: 'green',
    dashArray: '3',    
    className: feature.properties.COUNTY
    };
}

function mhnstyle(feature) {
    if (feature.properties.TYPE1 == 1) {
        return {
            weight: 0.7,
            opacity: 1,
            color: "grey",
            className: feature.properties.Name_1
            };
    }
    else {
    return {
    weight: 1.5,
    opacity: 1,
    color: "white",
    className: feature.properties.Name_1,
    };
}}

var counties = L.geoJSON(countiesdata, {
        style: countystyle,
        onEachFeature: function(feature, layer) {
            // layer.bindTooltip(feature.properties.COUNTY)     
    }});

counties.addTo(regionmap);

var mhn = L.geoJSON(mhndata, {
        style: mhnstyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.Name_1) 
            layer.on({
                'mouseover':highlightFeature,
                'mouseout':resetHighlight
            });
}}).addTo(regionmap);



