function makeScatter(csv_file, chart_id){
  var margin = {top: 5, right: 5, bottom: 20, left: 50},
	    width = 900 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom;

    var padding = 10;
	  var svg = d3.select(chart_id).append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  d3.csv(csv_file, types, function(error, data){
      var x = d3.scaleLinear()
       .domain([0,d3.max(data, function(d){
         return d.obs_vmt;
        })])
       .range([padding,width - padding*2]);

  	  var y = d3.scaleLinear()
      .domain([d3.min(data, function(d){
        return(d.vmt);
      }),
      d3.max(data, function(d){
        return d.vmt;
       })]) //y range is reversed because svg
       .range([height-padding, padding]);

  	  var xAxis = d3.axisBottom()
  	      .scale(x);

  	  var yAxis = d3.axisLeft()
  	      .scale(y);


      //x = survey
      //Y = Model
	    y.domain(d3.extent(data, function(d){ return parseFloat(d.vmt)}));
	    x.domain(d3.extent(data, function(d){ return parseFloat(d.obs_vmt)}));

	    // see below for an explanation of the calcLinear function
      var yval = data.map(function (d) { return parseFloat(d.vmt); });
      var xval = data.map(function (d) { return parseFloat(d.obs_vmt); });
	    var lr = linearRegression(yval,xval);
      d3.select("#r2").text(parseFloat(lr.r2).toPrecision(4));
      var max = d3.max(data, function (d) { return d.obs_vmt; });
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

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);

	    svg.selectAll(".point")
	        .data(data)
	      .enter().append("circle")
	        .attr("class", "point")
	        .attr("r", 3)
	        .attr("cy", function(d){ return y(d.vmt)})
	        .attr("cx", function(d){ return x(d.obs_vmt)})
          .style("fill","#1C4E80")
          .style("stroke","#A6BACE");

	  });

	  function types(d){
	    d.obs_vmt = +d.obs_vmt;
	    d.vmt = +d.vmt;

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
