
  // basic map
  var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';
  var lat= 41.8781;
  var long = -87.9298;
  var center = new L.LatLng(lat, long);
  function zoomTo(location, map) {
    map.setView(location, 8);
    }


  var interstate_map = new L.Map("interstate_map", {
      zoomControl: false,
      center: new L.LatLng(41.8781, -87.9298),
      zoom: 8
  });

  var baselayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
      id: 'mapbox.light',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  })

  $("a[href='#8']").on('shown.bs.tab',function(e) {
      interstate_map.invalidateSize();
  });
    interstate_map.addLayer(baselayer2);

  var hwy_lyr = L.geoJSON(hwy_clean, {
    style: {
      color: "grey",
      weight: 3
    },
    // style: baseStyle,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.ROADNAME)
  }
  });
  hwy_lyr.addTo(interstate_map);

  var cmap2 = L.geoJSON(cmaparea, {
    style: {
        color: "darkgrey",
        fillOpacity: 0,
        weight: 2
    },
    interactive: false
}).addTo(interstate_map);
