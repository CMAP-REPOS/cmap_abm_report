function make_multi_line(chartID, csv){
  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 70, left: 50},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // Define the line
  var line = d3.line()
      .x(function(d) { return x(d.range); })
      .y(function(d) { return y(d.rmse); });

  // Adds the svg canvas
  var svg = d3.select("#"+chartID)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 -100 650 500")
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv(csv, function(error, data) {
      data.forEach(function(d) {
  		d.range = +d.range;
  		d.rmse = +d.rmse;
      });

      // Scale the range of the data
      x.domain([1, d3.max(data, function(d) { return d.range; })]).nice();
      y.domain([0, d3.max(data, function(d) { return d.rmse; })]).nice();

      // Nest the entries by series
      var dataNest = d3.nest()
          .key(function(d) {return d.series;})
          .entries(data);

      // set the colour scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      legendSpace = width/dataNest.length; // spacing for the legend

      // Loop through each series / key
      dataNest.forEach(function(d,i) {

          svg.append("path")
              .attr("class", "line")
              .style("stroke", function() { // Add the colours dynamically
                  return d.color = color(d.key); })
              .attr("d", line(d.values));

          // Add the Legend
          svg.append("text")
              .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
              .attr("y", height + (margin.bottom/2)+ 5)
              .attr("class", "legend")    // style the legend
              .style("fill", function() { // Add the colours dynamically
                  return d.color = color(d.key); })
              .text(d.key);
      });

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

  });
}
