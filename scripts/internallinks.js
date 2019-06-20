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
