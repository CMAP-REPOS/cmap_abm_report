//https://stackoverflow.com/questions/26352181/link-to-specific-tab-bootstrap
//https://stackoverflow.com/questions/1343178/change-active-li-when-clicking-a-link-jquery

$(function() {
  // Javascript to enable link to tab
  var hash = document.location.hash;
  if (hash) {
    //console.log(hash);
    $('.nav-tabs a[href=\\'+hash+']').tab('show');
  }

  // Change hash for page-reload
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    window.location.hash = e.target.hash;
    window.scrollTo(0,0);
    var hash = document.location.hash;
    $('li').removeClass();
    $('.nav-tabs a[href=\\'+hash+']').parent().addClass('active');
  });
});

var legend = d3.select("#vmtLegend").append("svg")
.attr("height", 75)
.attr("width", 250)

legend.selectAll("mydots")
  .data(["#98abc5", "#8a89a6"])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["Auto", "Truck" ])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")


function modelsurveylegend(divID) {
  var legend = d3.select(divID).append("svg")
  .attr("height", 70)
  .attr("width", 250)

  legend.selectAll("mydots")
    .data(["#0E84AC","#548E3F"])
    .enter()
    .append("circle")
      .attr("cx", 10)
      .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d) { return d; })

  // Add one dot in the legend for each name.
  legend.selectAll("mylabels")
    .data(["Model", "Observed" ])
    .enter()
    .append("text")
      .attr("x", 20)
      .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .text(function(d){
        return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("fill","black")
};

modelsurveylegend("#autoLegend")
modelsurveylegend("#tripspersonLegend")
modelsurveylegend("#tripsbyincomeLegend")
modelsurveylegend("#tripspurposemodeLegend")
modelsurveylegend("#dapLegend")
modelsurveylegend("#tripsptypepurposeLegend")
modelsurveylegend("#tripsDistancePurposeLegend")
modelsurveylegend("#tripspurposedistLegend")
modelsurveylegend("#worktripsLegend")
modelsurveylegend("#worktripsdistanceLegend")
modelsurveylegend("#workbasedwalktripsLegend")
modelsurveylegend("#transitaccessLegend")
modelsurveylegend("#transitincomeLegend")
modelsurveylegend("#transittripsratioLegend")
modelsurveylegend("#highwayvmtLegend")
modelsurveylegend("#transitboardingLegend")



var legend = d3.select("#tourRateLegend").append("svg")
.attr("height", 75)
.attr("width", 250)

legend.selectAll("mydots")
  .data(["rgb(105, 179, 162)", "rgb(76, 64, 130)"])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["Model", "Survey" ])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")



var legend = d3.select("#tourpurposeLegend").append("svg")
.attr("height", 75)
.attr("width", 250)

legend.selectAll("mydots")
  .data(["rgb(166, 186, 206)", "rgb(120, 150, 180)"])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["Individual", "Joint" ])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")


  var legend = d3.select("#stackedAdultLegend").append("svg")
    .attr("height", 140)
    .attr("width", 250)

    legend.selectAll("mydots")
      .data(['#0E84AC',	'#D8BA37',	'#5F7B88',	'#9675B4'])
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) { return d; })

    // Add one dot in the legend for each name.
    legend.selectAll("mylabels")
      .data(["1 Adult", "1 Adult", "3 Adults", "4+ Adults"])
      .enter()
      .append("text")
        .attr("x", 20)
        .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function(d){
          return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("fill","black")


var legend = d3.select("#stackedAutoLegend").append("svg")
.attr("height", 140)
.attr("width", 250)

legend.selectAll("mydots")
  .data(['#0E84AC',	'#D8BA37',	'#5F7B88',	'#9675B4',	'#548E3F'])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["0 Vehicles", "1 Vehicle", "2 Vehicles", "3 Vehicles", "4+ Vehicles" ])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")


var legend = d3.select("#vmtfacilityLegend").append("svg")
.attr("height", 140)
.attr("width", 250)

legend.selectAll("mydots")
  .data(["#0E84AC", "#548E3F", "#D8BA37", "#5F7B88"])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["Local", "Arterial", "Interstate"])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")

// select the svg area
var svg = d3.select("#transitmaplegend")

  // metra
  svg.append("line").attr("x1",10).attr("y1",10).attr("x2",30).attr("y2",10).style("stroke", "grey").style("stroke-width",2)
  svg.append("text")
  .attr("x", 35)
  .attr("y", 10)
  .text("Metra Lines")
  .style("font-size", "14px")
  .style("font-family","sans-serif")
  .attr("alignment-baseline","middle")

  //cta
  svg.append("line").attr("x1",10).attr("y1",30).attr("x2",30).attr("y2",30).style("stroke", "black").style("stroke-width",2)
  svg.append("text")
  .attr("x", 35)
  .attr("y", 30)
  .text("CTA Lines")
  .style("font-size", "14px")
  .style("font-family","sans-serif")
  .attr("alignment-baseline","middle")
