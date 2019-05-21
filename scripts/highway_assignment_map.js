
  // basic map
  var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';

  var interstate_map = new L.Map("interstate_map", {
      zoomControl: false,
      center: new L.LatLng(41.8781, -87.9298),
      zoom: 8
  });
  
  var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
      id: 'mapbox.light',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  })
  
  $("a[href='#8']").on('shown.bs.tab',function(e) {
      interstate_map.invalidateSize();
  });
    interstate_map.addLayer(baselayer);
  
  var hwy_lyr = L.geoJSON(hwy_fc, {
    // style: baseStyle,
    // onEachFeature: function(feature, layer) {
    //     layer.bindPopup(feature.properties.AREANAME)
    //     layer.NAME = feature.properties.AREANAME;
  //}
  });
  hwy_lyr.addTo(interstate_map);
  
  