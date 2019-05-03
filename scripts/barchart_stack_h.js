function makeStackedChart_nodd_h(csv_file,dataTitle,divID){

  var divText = document.getElementById(dataTitle);
  allKey = 'CMAP Region'
  catInt = allKey;
  //console.log(catInt);

  d3.csv(csv_file, function(error, data) {
    if (error) throw error;
    //catInt = allKey;
    //d3.select(catID).on('change', update);
    data.forEach(function(d){
      d.Value = parseInt(d.Value);
    })

    var margin = {top: 35, right: 75, bottom: 20, left: 150},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    height2 = 575 - margin.top - margin.bottom;

    var padding = 10;

    var g = d3.select("#" + divID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("align","center")
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    var y0 = d3.scaleBand()
        .rangeRound([0, height])
        .paddingInner(0.1);

    var y1 = d3.scaleBand()
        .padding(0.05);

    var x = d3.scaleLinear()
          .range([0, width]);

    var y1 = d3.scaleBand()

    var z = d3.scaleOrdinal()
        .range(["#A6BACE", "#7896B4", "#4A729A", "#1C4E80", "#0D263F"]);

    var stack = d3.stack();

    ////console.log("data", data);
    ////console.log("data", newdata);
    x.domain([0,
    d3.max(data, function(d){
      return d.Value;
     })]) //y range is reversed because svg
     .range([width-padding, padding]);

    y0.domain(data.map(function(d) {
      return d.MainGroup; }));
    y1.domain(data.map(function(d) {
      return d.SubGroup; }).reverse())
      .rangeRound([0, y0.bandwidth()])
      .padding(0.2);

    z.domain(data.map(function(d) {
      return d.StackGroup; }))

    var keys = z.domain()

    var groupData = d3.nest()
      .key(function(d) {
            return d.SubGroup + d.MainGroup;
      })
      .rollup(function(d, i){
        ////console.log(d[0].Category)
            ////console.log(d)
            var d2 = {SubGroup: d[0].SubGroup, MainGroup: d[0].MainGroup}
          d.forEach(function(d){
              d2[d.StackGroup] = d.Value;
              divText = d.Title;
          })
          //console.log("rollup d", d, d2);
          return d2;
      })
      .entries(data)
      .map(function(d){
        return d.value;
      });

    console.log("groupData", groupData)

    var stackData = stack
      .keys(keys)(groupData)
    d3.select("#" + dataTitle).text(divText);
    //console.log("stackData", stackData)

    x.domain([0, d3.max(data, function(d){
      return d.Value;
     })]).nice();

    ////console.log("keys", keys)

    var serie = g.selectAll(".serie")
      .data(stackData)
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {
          return z(d.key);
        });

    serie.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
        .attr("class", "serie-rect")
        .attr("transform", function(d) {
          return "translate(0," + y0(d.data.MainGroup) + ")";
        })
        .attr("y", function(d) {
          ////console.log(d);
          return y1(d.data.SubGroup);
        })
        .attr("x", function(d) {
          ////console.log(d);
          return x(d[1]);
        })
        .attr("width", function(d) {
          return x(d[0]) - x(d[1]);
        })
        .attr("height", y1.bandwidth())
        .on("click", function(d, i){ });


    // g.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0," + height * 1.1 + ")")
    //     .call(d3.axisLeft(x0))

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(20," + height + ")")
        .call(d3.axisBottom(x).ticks(null, "s"))
      .append("text")
        .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5)
        .attr("dx", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")

        // Add the X Axis
       g.append("g")
           .attr("class", "y axis")
           .call(d3.axisLeft(y0))
           .selectAll("text")
            .style("text-anchor", "end")
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
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                  .attr("x", width - 19)
                  .attr("y", -20)
                  .attr("width", 19)
                  .attr("height", 19)
                  .attr("fill", function(d) { return z(d.key); });

            legend.append("text")
              .attr("x", width-30)
              .attr("y", -10)
              .attr("dy", "0.32em")
              .style("fill","black")
              .text(function(d) {
                return d.key;
              });

      });

}
