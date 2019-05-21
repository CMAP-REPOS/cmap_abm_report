function hStackedBar(obscsv_file,modelcsv_file,obsID,modelID, mapID){

  var formatValue = d3.format(".2s");
  var margin = {top: 35, right: 20, bottom: 100, left: 160},
    width = 300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;



  makechart(modelcsv_file, modelID, false);
  makechart(obscsv_file, obsID, true);

function makechart(csv_file, divID, axis){

  var g = d3.select("#"+divID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("align","center")
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var y = d3.scaleBand()			// x = d3.scaleBand()
      .rangeRound([0, height])	// .rangeRound([0, width])
      .paddingInner(0.25)
      .align(0.1);

  var x = d3.scaleLinear()		// y = d3.scaleLinear()
      .rangeRound([0, width]);	// .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  d3.csv(csv_file, function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
     d.total = t;
     return d;
    }, function(error, data) {
     if (error) throw error;

     var keys = data.columns.slice(1);

     data.sort(function(a, b) { return b.total - a.total; });
     y.domain(data.map(function(d) { return d.Index; }));					// x.domain...
     x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();	// y.domain...
     z.domain(keys);


    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) {
          return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) {
          return y(d.data.Index); })	    //.attr("x", function(d) { return x(d.data.Index); })
        .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth())
        .attr("class", function(d) {return d.data.Index.replace(/\s/g, '')})
        // this highlights the same line on the two bar charts
        .on("mouseover", function(d) {
          d3.selectAll("." + d.data.Index.replace(/\s/g, '')).attr("fill", "red");
          selectedline = d.data.Index
          // this highlights the line on the map!
          metra.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:"Red"
            })
            }})
          cta.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:"Red"
            })
            }})
          })
        .on("mouseout", function(d) {
          d3.selectAll("." + d.data.Index.replace(/\s/g, '')).attr("fill", function(d) {
            return z(d.key); });
          selectedline = d.data.Index
          // this highlights the line on the map!
          metra.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:'#696969'
            })
            }})
          cta.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:"black"
            })
            }})
        });


    if(axis == true){
       g.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
          .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));
    }
    // g.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
  	  .attr("transform", "translate(0,"+height+")")				// New line
        .call(d3.axisBottom(x).ticks(4, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
  	  .attr("transform", "translate("+ (-width) +",30)");   	// Newline

    if(axis == false){

      var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    	 .attr("transform", function(d, i) { return "translate(10," + (300 + i * 20) + ")"; });

      legend.append("rect")
          .attr("x", width)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });

    }
  });

}

}