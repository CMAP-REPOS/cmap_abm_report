// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

var commutemap = new L.Map("commutemap", {
    zoomControl: false,
    center: new L.LatLng(lat, long),
    zoom: 7
});

var center = new L.LatLng(lat, long);

function zoomTo(location, map) {
	map.setView(location, 8);
	}

// display correctly on tab load
$("a[href='#12']").on('shown.bs.tab',function(e) {
    commutemap.invalidateSize();
});

// basemap
var baselayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

commutemap.addLayer(baselayer2);

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
function countystyle(feature) {
    return {
    weight: 2,
    fillOpacity: 0,
    color: 'grey',
    dashArray: '3',
    className: feature.properties.COUNTY
    };
}

function mhnstyle(feature) {
    if (feature.properties.TYPE1 == 1) {
        return {
            weight: 0.5,
            opacity: 1,
            color: "#87BBA2"
            };
    }
    else {
    return {
    weight: 2.5,
    opacity: 1,
    color: "#337AB7"
    };
}}


// assemble layers
var counties = L.geoJSON(countiesdata, {
        style: countystyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.COUNTY)
            layer.on({
                'mouseover':highlightFeatureintro,
                'mouseout': resetHighlightintro
            })
    }});

counties.addTo(commutemap);

var cmap2 = L.geoJSON(cmaparea, {
    style: {
        color: "blue",
        fillOpacity: 0.1,
        weight: 0
    },
    interactive: false
}).addTo(commutemap);
