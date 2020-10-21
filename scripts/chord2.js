
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';
var lat= 41.7281;
var long = -87.9298;
var wflowmap = new L.Map("wflowmap", {
    zoomControl: false,
    center: new L.LatLng(lat, long),
    zoom: 7
});
function baseStyle(feature) {
    return {
    weight: 2,
    fillOpacity: 0,
    color: 'grey',
    dashArray: '3',
    className: feature.properties.AREANAME
    };
}

// basic map

var baselayer1 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v10',
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
})

$("a[href='#4']").on('shown.bs.tab',function(e) {
    wflowmap.invalidateSize();
});
wflowmap.addLayer(baselayer1);

var rings = L.geoJSON(workflow_geo, {
  style: baseStyle,
  onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.AREANAME)
      layer.NAME = feature.properties.AREANAME;
}});
rings.addTo(wflowmap);

var center = new L.LatLng(lat, long);
function zoomTo(location, map) {
  map.setView(location, 7);
  }


function makeChords(csv_file, modelDiv, obsDiv){

  var svg1;
  var svg2;
  var newCurrentDistrict;
  var newCurrentDistrict;
  var odpairs={};
  var colors = d3.scaleOrdinal()
          .domain(d3.range(16))
          .range([
            '#081D58',
            '#1C4E80',
            '#6A9BCC',
            '#AEC1D5',

            '#CFCFCF',
            '#ABABAB',
            '#595959',

            '#821E20',
            '#CF4446',
            '#DB6B3D',


            '#9C4624',
            '#69544C',

            '#D7D55C',
            '#8A882D',

            '#3D3C0E',
          ])





  d3.csv(csv_file, function(error, data) {

            var modelData = data.filter(function(d){
              if (d.Category == "Model"){
                d.count = parseInt(d.count)
                return data;
              };
            });
           //console.log(modelData)

            var obsData = data.filter(function(d){
              if (d.Category == "Survey"){
                d.count = parseInt(d.count)
                return data;
              };
            });
            var mpr = chordMpr(modelData);
            mpr.addValuesToMap('root')
                .addValuesToMap('node')
                .setFilter(function(row, a, b) {
                    return (row.root === a.name && row.node === b.name)
                })
                .setAccessor(function(recs, a, b) {
                    if (!recs[0]) return 0;
                    return +recs[0].count;
                });

            //console.log(obsData)
              var ompr = chordMpr(obsData);
              ompr.addValuesToMap('root')
                  .addValuesToMap('node')
                  .setFilter(function(row, a, b) {
                      return (row.root === a.name && row.node === b.name)
                  })
                  .setAccessor(function(recs, a, b) {
                      if (!recs[0]) return 0;
                      return +recs[0].count;
                  });

            for(var key in modelData){
              var dictkey = modelData[key].root
              var value = modelData[key].node
              if (!(dictkey in odpairs)){
                if (dictkey!=value){
                  odpairs[dictkey] = [value]
                }
              }
              else{
                if (dictkey!=value & (!(value in odpairs[dictkey]))){
                  odpairs[dictkey].push(value)
                }
              }
            }

            drawChords(mpr.getMatrix(), mpr.getMap(), ompr.getMatrix(), ompr.getMap(), odpairs);
        });



        function handlemouseover(d, i) {
            var activeDistrict = i;
            var newCurrentDistrict = d.name;

            svg1.selectAll("path.chord")
                .filter(function(d) {
                  return d.source.index != activeDistrict && d.target.index != activeDistrict; })
                .transition()
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0);

            svg2.selectAll("path.chord")
                .filter(function(d) {
                  return d.source.index != activeDistrict && d.target.index != activeDistrict;
                })
        		.transition()
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0);

          var color_dict=[]
          svg1.selectAll("path")
              .filter(function(d) {
                return color_dict[d.name] = colors(d.index)
              })
          rings.eachLayer(function(layer) {
            if(layer.NAME == newCurrentDistrict){
              layer.setStyle({
                weight: 2,
                fillOpacity: 1,
                fillColor:colors(i)
            })
            }
            else if(odpairs[newCurrentDistrict].includes(layer.NAME)){
              layer.setStyle({
                weight: 2,
                fillOpacity: .2,
                fillColor: color_dict[layer.NAME],
            })
            }
            else{
              layer.setStyle({
                weight: 2,
                fillOpacity: 0,
                color: 'grey',
            })
            }
          });
          }


          function handlemouseout(d, i) {
            var activeDistrict = i;
            var newCurrentDistrict = d.name;

            svg1.selectAll("path.chord")
                .filter(function(d) {
                  return d.source.index != activeDistrict && d.target.index != activeDistrict; })
        		.transition()
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8);

            svg2.selectAll("path.chord")
                .filter(function(d) {
                  return d.source.index != activeDistrict && d.target.index != activeDistrict;
                })
        		.transition()
                .style("stroke-opacity", 0.8)
                .style("fill-opacity", 0.8);

          var color_dict=[]
          svg1.selectAll("path")
              .filter(function(d) {
                return color_dict[d.name] = colors(d.index)
              })
          rings.eachLayer(function(layer) {
            if(layer.NAME == newCurrentDistrict){
              layer.setStyle({
                weight: 2,
                fillOpacity: 1,
                fillColor:colors(i)
            })
            }
            else if(odpairs[newCurrentDistrict].includes(layer.NAME)){
              layer.setStyle({
                weight: 2,
                fillOpacity: .2,
                fillColor: color_dict[layer.NAME],
            })
            }
            else{
              layer.setStyle({
                weight: 2,
                fillOpacity: 0,
                color: 'grey',
            })
            }
          });
          }

        function drawChords(matrix, mmap, obsMatrix, obs_mmap, odpairs) {
            var w = 350,
                h = 400,
                r1 = (h - 30) / 2,
                r0 = r1 - 80;

            var chord = d3.chord()
                .padAngle(0.05)
                .sortSubgroups(d3.descending)
                .sortChords(d3.descending);

            var arc = d3.arc()
                .innerRadius(r0)
                .outerRadius(r0 + 20);

            var ribbon = d3.ribbon()
                .radius(r0);

            svg1 = d3.select("#" + obsDiv).append("svg:svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "-10 -200 350 600")
            .attr("align","center")
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")")
            .append("svg:g")
            .attr("id", "circle")
            .datum(chord(obsMatrix));

            svg1.append("circle")
                .attr("r", r0 + 20);

            var mapReader = chordRdr(obsMatrix, obs_mmap);

            var g = svg1.selectAll("g.group")
                .data(function(chords) {
                    return chords.groups;
                })
                .enter().append("svg:g")
                .attr("class", "group")
                .on("mouseover", handlemouseover)
              	.on("mouseout", handlemouseout);

            var colors = d3.scaleOrdinal()
                    .domain(d3.range(16))
                    .range([
                        '#081D58',
                        '#1C4E80',
                        '#6A9BCC',
                        '#AEC1D5',

                        '#CFCFCF',
                        '#ABABAB',
                        '#595959',

                        '#821E20',
                        '#CF4446',
                        '#DB6B3D',


                        '#9C4624',
                        '#69544C',

                        '#D7D55C',
                        '#8A882D',

                        '#3D3C0E',




                    ])

            g.append("svg:path")
                .style("stroke", "grey")
                .style("fill", function(d) {
                    return colors(d.index);
                })
                .attr("d", arc);

            g.append("svg:text")
                .each(function(d) {
                    d.angle = (d.startAngle + d.endAngle) / 2;
                })
                .attr("dy", ".35em")
                .style("font-family", "helvetica, arial, sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", function(d) {
                    return d.angle > Math.PI ? "end" : null;
                })
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                        "translate(" + (r0 + 26) + ")" +
                        (d.angle > Math.PI ? "rotate(180)" : "");
                })
                .text(function(d) {
                    d.name = mapReader(d).gname
                    d.color = colors(d.index)
                    return mapReader(d).gname;
                });

            var colors = d3.scaleOrdinal()
                .domain(d3.range(16))
                .range([
                    '#081D58',
                    '#1C4E80',
                    '#6A9BCC',
                    '#AEC1D5',

                    '#CFCFCF',
                    '#ABABAB',
                    '#595959',

                    '#821E20',
                    '#CF4446',
                    '#DB6B3D',


                    '#9C4624',
                    '#69544C',

                    '#D7D55C',
                    '#8A882D',

                    '#3D3C0E',



                ])

            var chordPaths = svg1.selectAll("path.chord")
                .data(function(chords) {
                  //console.log(chords)
                    return chords;
                })
                .enter().append("svg:path")
                .attr("class", "chord")
                .style("stroke", "grey")
                .style("fill", function(d, i) {
                  //console.log(d)
                    return colors(d.source.index);
                })
                .attr("d", ribbon.radius(r0))
                //Chord 2

                svg2 = d3.select("#" + modelDiv).append("svg:svg")
                  .attr("preserveAspectRatio", "xMinYMin meet")
                  .attr("viewBox", "-10 -200 350 600")
                  .attr("align","center")
                  .append("g")
                  .attr("transform","translate(" + margin.left + "," + margin.top + ")")
                  .append("svg:g")
                  .attr("id", "circle")
                  .datum(chord(matrix));

                svg2.append("circle")
                    .attr("r", r0 + 20);

                var mapReader2 = chordRdr(matrix, mmap);


                var g2 = svg2.selectAll("g.group")
                    .data(function(chords) {
                        return chords.groups;
                    })
                    .enter().append("svg:g")
                    .attr("class", "group")
                    .on("mouseover", handlemouseover)
                  	.on("mouseout", handlemouseout);

                g2.append("svg:path")
                    .style("stroke", "grey")
                    .style("fill", function(d) {
                        return colors(d.index);
                    })
                    .attr("d", arc);

                g2.append("svg:text")
                    .each(function(d) {
                        d.angle = (d.startAngle + d.endAngle) / 2;
                    })
                    .attr("dy", ".35em")
                    .style("font-family", "helvetica, arial, sans-serif")
                    .style("font-size", "11px")
                    .attr("text-anchor", function(d) {
                        return d.angle > Math.PI ? "end" : null;
                    })
                    .attr("transform", function(d) {
                        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                            "translate(" + (r0 + 26) + ")" +
                            (d.angle > Math.PI ? "rotate(180)" : "");
                    })
                    .text(function(d) {
                      d.name = mapReader(d).gname
                      d.color = colors(d.index)
                        return mapReader(d).gname;
                    });

                var chordPaths2 = svg2.selectAll("path.chord")
                    .data(function(chords) {
                        return chords;
                    })
                    .enter().append("svg:path")
                    .attr("class", "chord")
                    .style("stroke", "grey")
                    .style("fill", function(d, i) {

                        return colors(d.source.index);
                    })
                    .attr("d", ribbon.radius(r0))
        }

        function target_style(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0,
            }); }



}
