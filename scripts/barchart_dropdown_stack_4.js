// sets up a stacked barchart with dropdown and 4 categories/8 bars
function makeStackedChart_4(csv_file,catID,dataTitle,divID){

  var divText = document.getElementById(dataTitle);
  catInt = d3.select(catID).property('value');
  //console.log(catInt);

  var margin = {top: 35, right: 50, bottom: 50, left: 80},
  width = 700 - margin.left - margin.right,
  height = 325 - margin.top - margin.bottom;
  height2 = 400 - margin.top - margin.bottom;


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
      .rangeRound([height, 0]);

  var y1 = d3.scaleBand()

  var z = d3.scaleOrdinal()
      .range(["#A6BACE", "#7896B4", "#4A729A", "#1C4E80", "#0D263F"]);

  var stack = d3.stack();


  d3.csv(csv_file, function(error, data) {
    if (error) throw error;
    catInt = d3.select(catID).property('value');
    d3.select(catID).on('change', update);

    var newdata = data.filter(function(d){
      if(d.Category == catInt){
        return data;
      };
    });

    newdata.forEach(function(d){
      d.Value = +d.Value;
    })

    ////console.log("data", data);
    ////console.log("data", newdata);

    x0.domain(newdata.map(function(d) {
      return d.MainGroup; }));
    x1.domain(newdata.map(function(d) {

      return d.SubGroup; }))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.2);

    z.domain(newdata.map(function(d) {
      return d.StackGroup; }))

    var keys = z.domain()

    var groupData = d3.nest()
      .key(function(d) {
            return d.SubGroup + d.MainGroup;
      })
      .rollup(function(d, i){
        ////console.log(d[0].Category)
            ////console.log(d)
            if(d[0].Category == catInt){
            var d2 = {SubGroup: d[0].SubGroup, MainGroup: d[0].MainGroup}
          }
          d.forEach(function(d){
            if(d.Category == catInt){
              d2[d.StackGroup] = d.Value;
              divText = d.Title;
            }
          })
          //console.log("rollup d", d, d2);
          return d2;
      })
      .entries(newdata)
      .map(function(d){ return d.value; });

    ////console.log("groupData", groupData)

    var stackData = stack
      .keys(keys)(groupData)
    d3.select("#" + dataTitle).text(divText);
    //console.log("stackData", stackData)

    y.domain([0,1500000]).nice();

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
        .on("click", function(d, i){ });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x1));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(150," + height + ")")
        .call(d3.axisBottom(x1));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(300," + height + ")")
        .call(d3.axisBottom(x1));

    g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(450," + height + ")")
    .call(d3.axisBottom(x1));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height * 1.1 + ")")
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

    g.append("text")
      .attr("transform",
            "translate(-50," +
                            (height/2) + ") rotate(-90)")
      .style("text-anchor", "middle")
      .text("Households");
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
            .attr("transform", function(d, i) { return "translate(50," + i * 15 + ")"; });

      legend.append("rect")
            .attr("x", width - 19)
            .attr("y", -20)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", function(d) { return z(d.key); });

      legend.append("text")
        .attr("x", width - 24)
        .attr("y", -10)
        .attr("dy", "0.32em")
        .style("fill","black")
        .text(function(d) {
          return d.key;
        });


        function update(){


          catInt = d3.select(catID).property('value');
          var newdata = data.filter(function(d){
            if(d.Category == catInt){
              return data;
            };
          });
          newdata.forEach(function(d){
            d.Value = +d.Value;
          })

          ////console.log("data", data);
          ////console.log("data", newdata);

          x0.domain(newdata.map(function(d) {
            return d.MainGroup; }));
          x1.domain(newdata.map(function(d) {

            return d.SubGroup; }))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.2);

          z.domain(newdata.map(function(d) {
            return d.StackGroup; }))

          var keys = z.domain()

          var groupData = d3.nest()
            .key(function(d) {
                  return d.SubGroup + d.MainGroup;
            })
            .rollup(function(d, i){
              //console.log(d[0].Category)
                  //console.log(d)
                  if(d[0].Category == catInt){
                  var d2 = {SubGroup: d[0].SubGroup, MainGroup: d[0].MainGroup}
                }
                d.forEach(function(d){
                  if(d.Category == catInt){
                    d2[d.StackGroup] = d.Value;
                    divText = d.Title;
                  }
                })
                //console.log("rollup d", d, d2);
                return d2;
                })
                .entries(newdata)
                .map(function(d){ return d.value; });

                ////console.log("groupData", groupData)

                var stackData = stack
                .keys(keys)(groupData)
                d3.select("#" + dataTitle).text(divText);
          //console.log("stackData", stackData)

          y.domain([0,1500000]).nice();

          //console.log("keys", keys)
          g.selectAll(".serie").remove();

          var new_layer = g.selectAll(".serie")
            .data(stackData)
            .enter().append("g")
              .attr("class", "serie")
              .attr("fill", function(d) { return z(d.key); });

          new_layer.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
              .attr("class", "serie-rect")
              .attr("transform", function(d) { return "translate(" + x0(d.data.MainGroup) + ",0)"; })
              .attr("x", function(d) {
                ////console.log(d);
                return x1(d.data.SubGroup); })
              .attr("y", function(d) {
                return y(d[1]); })
              .attr("height", function(d) { return y(d[0]) - y(d[1]); })
              .attr("width", x1.bandwidth())
              .on("click", function(d, i){ });

          g.selectAll(".axis").remove();

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x1));

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(150," + height + ")")
              .call(d3.axisBottom(x1));

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(300," + height + ")")
              .call(d3.axisBottom(x1));

          g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(450," + height + ")")
          .call(d3.axisBottom(x1));

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height * 1.1 + ")")
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
              var legend = new_layer.append("g")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("text-anchor", "end")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) { return "translate(50," + i * 15 + ")"; });

            legend.append("rect")
                  .attr("x", width - 19)
                  .attr("y", -20)
                  .attr("width", 19)
                  .attr("height", 19)
                  .attr("fill", function(d) { return z(d.key); });

            legend.append("text")
              .attr("x", width - 24)
              .attr("y", -10)
              .attr("dy", "0.32em")
              .style("fill","black")
              .text(function(d) {
                return d.key;
              });


        }
      });

}
