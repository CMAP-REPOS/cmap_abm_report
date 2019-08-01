function makeScatter(csv_file, chart_id, modelvalue,obsvalue,category_value,rsquared){
  var margin = {top: 5, right: 5, bottom: 50, left: 80},
	    width = 900 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom;

    var padding = 10;
	  var svg = d3.select(chart_id).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 -100 900 600")
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  d3.csv(csv_file, types, function(error, data){
      var x = d3.scaleLinear()
       .domain([0,d3.max(data, function(d){
         return d[obsvalue];
        })])
       .range([padding,width - padding*2]);

      console.log(d3.max(data, function(d){
        return d[obsvalue];
      }));

  	  var y = d3.scaleLinear()
      .domain([d3.min(data, function(d){
        return(d[modelvalue]);
      }),
      d3.max(data, function(d){
        return d[modelvalue];
       })]) //y range is reversed because svg
       .range([height-padding, padding]);

  	  var xAxis = d3.axisBottom()
          .scale(x)
          .tickFormat(d3.format(",.0f"));

  	  var yAxis = d3.axisLeft()
          .scale(y)
          .tickFormat(d3.format(",.0f"));


          // colors for foo
      var color = d3.scaleOrdinal()
      .domain(["Arterial/Collector", "Interstate" ])
      .range(["#A6BACE", "#4A729A"])

      //x = survey
      //Y = Model
	    y.domain(d3.extent(data, function(d){ return parseFloat(d[modelvalue])}));
	    x.domain(d3.extent(data, function(d){ return parseFloat(d[obsvalue])}));

	    // see below for an explanation of the calcLinear function
      var yval = data.map(function (d) { return parseFloat(d[modelvalue]); });
      var xval = data.map(function (d) { return parseFloat(d[obsvalue]); });
	    var lr = linearRegression(yval,xval);
      d3.select("#"+rsquared).text(parseFloat(lr.r2).toPrecision(4));
      var max = d3.max(data, function (d) { return d[obsvalue]; });
      var myLine = svg.append("line")
                  .attr("x1", x(0))
                  .attr("y1", y(lr.intercept))
                  .attr("x2", x(max))
                  .attr("y2", y( (max * lr.slope) + lr.intercept ))
                  .style("stroke", "black");

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height-padding) + ")")
          .call(xAxis);

        svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                              (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Observed: " + obsvalue);

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);

      svg.append("text")
      .attr("transform",
            "translate(-50," +
                            (height/2) + ") rotate(-90)")
      .style("text-anchor", "middle")
      .text("Model");

	    svg.selectAll(".point")
	        .data(data)
	      .enter().append("circle")
	        .attr("class", "point")
	        .attr("r", 3)
	        .attr("cy", function(d){ return y(d[modelvalue])})
	        .attr("cx", function(d){ return x(d[obsvalue])})
          .style("fill",function(d){
            return color(d[category_value])
          })
          .style("stroke","#f0f0f0")
          .style("stroke-width", .25) ;

	  });

	  function types(d){
	    d[obsvalue] = +d[obsvalue];
	    d[modelvalue] = +d[modelvalue];

	    return d;
	  }

    // Calculate a linear regression from the data

		// Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis

    // Returns an object with two points, where each point is an object with an x and y coordinate

    function linearRegression(y,x){

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;

};


}


var legend = d3.select("#scatterLegend").append("svg")
.attr("height", 75)
.attr("width", 250)

legend.selectAll("mydots")
  .data(["#A6BACE", "#4A729A"])
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d) { return d; })

// Add one dot in the legend for each name.
legend.selectAll("mylabels")
  .data(["Arterial/Collector", "Interstate" ])
  .enter()
  .append("text")
    .attr("x", 20)
    .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function(d){
      return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("fill","black")
