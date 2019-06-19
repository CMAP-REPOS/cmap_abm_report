// set up stacked barchart with no dropdown (no dd) and 7 categories/14 bars
function makeStackedChart_nodd(csv_file,dataTitle,divID){

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

    var margin = {top: 35, right: 75, bottom: 100, left: 45},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    height2 = 575 - margin.top - margin.bottom;

    var padding = 10;

    var g = d3.select("#" + divID).append("svg")
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
    .domain([0,40]) //y range is reversed because svg // set custom domain instead of using max function since we are stacking!
     .range([height-padding, padding]);

    var y1 = d3.scaleBand()

    var z = d3.scaleOrdinal()
        .range(["#A6BACE", "#7896B4", "#4A729A", "#1C4E80", "#0D263F"]);

    var stack = d3.stack();

    ////console.log("data", data);
    ////console.log("data", newdata);

    x0.domain(data.map(function(d) {
      return d.MainGroup; }));

    x1.domain(data.map(function(d) {

      return d.SubGroup; }))
      .rangeRound([0, x0.bandwidth()])
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
      .map(function(d){ return d.value; });

    console.log("groupData", groupData)

    var stackData = stack
      .keys(keys)(groupData)
    d3.select("#" + dataTitle).text(divText);
    //console.log("stackData", stackData)

    y.domain([0, 40]).nice();

    ////console.log("keys", keys)

    var serie = g.selectAll(".serie")
      .data(stackData)
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return z(d.key); });

    serie.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class", "serie-rect")
        .attr("transform", function(d) { return "translate(" + x0(d.data.MainGroup) + ",0)"; })
        .attr("x", function(d) {
          ////console.log(d);
          return x1(d.data.SubGroup); })
        .attr("y", function(d) {
          ////console.log(d);
          return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x1.bandwidth())

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x1));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(100," + height + ")")
        .call(d3.axisBottom(x1));

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(200," + height + ")")
    .call(d3.axisBottom(x1));

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(300," + height + ")")
    .call(d3.axisBottom(x1));

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(400," + height + ")")
    .call(d3.axisBottom(x1));

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(500," + height + ")")
    .call(d3.axisBottom(x1));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(600," + height + ")")
        .call(d3.axisBottom(x1));

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

        // Add the X Axis
       g.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(12," + height * 1.1 + ")")
           .call(d3.axisBottom(x0))
           .call(d3.axisBottom(x0).tickSize(0))
           .selectAll("text")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(0)"
                });


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
