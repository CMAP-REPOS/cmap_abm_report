// source: https://www.d3-graph-gallery.com/graph/lollipop_cleveland.html
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 150},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#tourrates")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 -50 960 600")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/csv31_tour_rates.csv", function(data) {


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 2])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("font-size","12px")


  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(1);
  svg.append("g")
    .attr("transform","translate(0,0)")
    .call(d3.axisLeft(y))
    .attr("font-size","12px")

  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.model); })
      .attr("x2", function(d) { return x(d.survey); })
      .attr("y1", function(d) { return y(d.group); })
      .attr("y2", function(d) { return y(d.group); })
      .attr("stroke", "grey")
      .attr("stroke-width", "1px")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.model); })
      .attr("cy", function(d) { return y(d.group); })
      .attr("r", "6")
      .style("fill", "#69b3a2")

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.survey); })
      .attr("cy", function(d) { return y(d.group); })
      .attr("r", "6")
      .style("fill", "#4C4082")
})
