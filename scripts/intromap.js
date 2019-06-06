// select the svg area
var svg = d3.select("#intromaplegend")

// Modeling Area
svg.append("line").attr("x1",10).attr("y1",20).attr("x2",30).attr("y2",20).style("stroke", "#1c4e80").style("stroke-dasharray","5,5")
svg.append("text")
.attr("x", 35)
.attr("y", 20)
.text("Modeling Area")
.style("font-size", "14px")
.style("font-family","sans-serif")
.attr("alignment-baseline","middle")

// CMAP
svg.append("line").attr("x1",10).attr("y1",40).attr("x2",30).attr("y2",40).style("stroke", "#233D4D").style("stroke-width",5)
svg.append("text")
.attr("x", 35)
.attr("y", 40)
.text("CMAP Region")
.style("font-size", "14px")
.style("font-family","sans-serif")
.attr("alignment-baseline","middle")

//hwy_interstates
svg.append("line").attr("x1",10).attr("y1",60).attr("x2",30).attr("y2",60).style("stroke", "#337AB7").style("stroke-width",5)
svg.append("text")
.attr("x", 35)
.attr("y", 60)
.text("Interstates")
.style("font-size", "14px")
.style("font-family","sans-serif")
.attr("alignment-baseline","middle")

//arterials
svg.append("line").attr("x1",10).attr("y1",80).attr("x2",30).attr("y2",80).style("stroke", "#87BBA2").style("stroke-width",5)
svg.append("text")
.attr("x", 35)
.attr("y", 80)
.text("Arterials")
.style("font-size", "14px")
.style("font-family","sans-serif")
.attr("alignment-baseline","middle")


// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

var regionmap = new L.Map("regionmap", {
    zoomControl: false,
    center: new L.LatLng(41.8781, -87.8298),
    zoom: 8
});

// var regionbaselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
//     id: 'mapbox.streets',
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
// })

$("a[href='#1']").on('shown.bs.tab',function(e) {
    regionmap.invalidateSize();
});
//regionmap.addLayer(regionbaselayer);

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

regionmap.addLayer(Stamen_TonerLite);

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

var counties = L.geoJSON(countiesdata, {
        style: countystyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.COUNTY)
            layer.on({
                'mouseover':highlightFeatureintro,
                'mouseout': resetHighlightintro
            })
    }});

counties.addTo(regionmap);

var mhn = L.geoJSON(mhndata, {
        style: mhnstyle,
        interactive: false
}).addTo(regionmap);

var cmap2 = L.geoJSON(cmaparea, {
    style: {
        color: "#233D4D",
        fillOpacity: 0,
        weight: 4
    },
    interactive: false
}).addTo(regionmap);
