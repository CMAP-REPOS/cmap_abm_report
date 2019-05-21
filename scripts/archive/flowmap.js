// basic map
var csv = 'data/csv4_chord.csv'
var origin;
var destination;

var wflowmap = new L.Map("wflowmap", {
    zoomControl: false,
    center: new L.LatLng(41.8781, -87.8298),
    zoom: 8
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(wflowmap);

$("a[href='#1']").on('shown.bs.tab',function(e) {
    wflowmap.invalidateSize();
});

function changeCurrentDistrict(newCurrentDistrict){

	if(newCurrentDistrict = null){
		var counties = L.geoJSON(workflow_geo, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.subzoneGroups_csv_AREANAME)
    }});

		counties.addTo(wflowmap);
	}
		
    else{

    	console.log(newCurrentDistrict)
    }

	 d3.csv(csv, function(error, data) {
            var modelData = data.filter(function(d){
              ////console.log(d)
              if (d.name == newCurrentDistrict){
                return data;
              };
            });
        });



}