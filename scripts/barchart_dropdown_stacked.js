function makeStackedChart(csv_file, catID){

  catInt = d3.select(catID).property('value');
  console.log(catInt);

  var margin = {top: 35, right: 80, bottom: 35, left: 45},
  width = 650 - margin.left - margin.right,
  height = 325 - margin.top - margin.bottom;


  var g = d3.select("#stackedbar").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  var x1 = d3.scaleBand()
      .padding(0.05);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var y1 = d3.scaleBand()

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);


  update()
  d3.select(catID).on('change', update);

  function update() {
    d3.csv(csv_file, function(error, data) {
      if (error) throw error;

      data.filter(function(d){
        if(d.Category == catInt){
          return data;
        }

        ;
      });

      data.forEach(function(d){
        d.Value = +d.Value;
      })

    	console.log("data", data);

      x0.domain(data.map(function(d) { return d.State; }));
      x1.domain(data.map(function(d) { return d.Year; }))
        .rangeRound([0, x0.bandwidth()])
      	.padding(0.2);

      z.domain(data.map(function(d) { return d.AgeGroup; }))
      var keys = z.domain()

      var groupData = d3.nest()
        .key(function(d) { return d.Year + d.State; })
      	.rollup(function(d, i){

          var d2 = {Year: d[0].Year, State: d[0].State}
          d.forEach(function(d){
            d2[d.AgeGroup] = d.Value

            return d.Category == catID;
          })
          console.log("rollup d", d, d2);
        	return d2;
        })
        .entries(data)
      	.map(function(d){ return d.value; });

      console.log("groupData", groupData)

      var stackData = stack
      	.keys(keys)(groupData)

      console.log("stackData", stackData)

      //y.domain([0, d3.max(data, function(d) { return d.Value; })]).nice();

      console.log("keys", keys)

      var serie = g.selectAll(".serie")
        .data(stackData)
        .enter().append("g")
          .attr("class", "serie")
          .attr("fill", function(d) { return z(d.key); });

      serie.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
      		.attr("class", "serie-rect")
      		.attr("transform", function(d) { return "translate(" + x0(d.data.State) + ",0)"; })
          .attr("x", function(d) {
            console.log(d);
            return x1(d.data.Year); })
          .attr("y", function(d) {
            console.log(d);
            return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width", x1.bandwidth())
      		.on("click", function(d, i){ console.log("serie-rect click d", i, d); });

      g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x0));

      g.append("g")
          .attr("class", "axis")
          .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Population");
    /*
      var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });

          */

      var legend = serie.append("g")
          .attr("class", "legend")
          .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x0(d.data.State) + x1(d.data.Year) + x1.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

      legend.append("line")
          .attr("x1", -6)
          .attr("x2", 6)
          .attr("stroke", "#000");

      legend.append("text")
          .attr("x", 9)
          .attr("dy", "0.35em")
          .attr("fill", "#000")
          .style("font", "10px sans-serif")
          .text(function(d) { return d.key; });

    });
  }
}
