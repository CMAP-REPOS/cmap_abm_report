function makeStackedChart_4(csv_file, catID, dataTitle, divID,legendID) {

  var divText = document.getElementById(dataTitle);
  catInt = d3.select(catID).property('value');
  //console.log(catInt);


  var margin = {
      top: 80,
      right: 50,
      bottom: 50,
      left: 80
    },
    width = 800 - margin.left - margin.right,
    height = 375 - margin.top - margin.bottom;
  height2 = 400 - margin.top - margin.bottom;

  var durations = 0;
  var xlabel = ["Model","Observed","Model","Observed","Model","Observed","Model","Observed","Model","Observed","Model","Observed","Model","Observed","Model","Observed"]

  let afterLoad = () => durations = 750;
  var g = d3.select("#" + divID).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 760 800")
    .attr("align", "center")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  var x1 = d3.scaleBand()
    .padding(0.05);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var y1 = d3.scaleBand()

  var z = d3.scaleOrdinal()
    .range(['#0E84AC', '#D8BA37', '#5F7B88', '#9675B4', '#548E3F']);

  var stack = d3.stack();


  d3.csv(csv_file, function(error, data) {
    if (error) throw error;
    catInt = d3.select(catID).property('value');
    d3.select(catID).on('change', update);

    var newdata = data.filter(function(d) {
      if (d.Category == catInt) {
        return data;
      };
    });

    newdata.forEach(function(d) {
      d.Value = +d.Value;
    })

    ////console.log("data", data);
    ////console.log("data", newdata);

    x0.domain(newdata.map(function(d) {
      return d.MainGroup;
    }));
    x1.domain(newdata.map(function(d) {
        return d.SubGroup;
      }))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.2);

    var x2 = d3.scaleLinear()
        .domain([0,d3.max(newdata,function(d){
          return +d.xlabel
        })]).range([40,width-30]);

    z.domain(newdata.map(function(d) {
      return d.StackGroup;
    }))

    var keys = z.domain()

    var groupData = d3.nest()
      .key(function(d) {
        return d.SubGroup + d.MainGroup;
      })
      .rollup(function(d, i) {
        ////console.log(d[0].Category)
        ////console.log(d)
        if (d[0].Category == catInt) {
          var d2 = {
            SubGroup: d[0].SubGroup,
            MainGroup: d[0].MainGroup
          }
        }
        d.forEach(function(d) {
          if (d.Category == catInt) {
            d2[d.StackGroup] = d.Value;
            divText = d.Title;
          }
        })
        //console.log("rollup d", d, d2);
        return d2;
      })
      .entries(newdata)
      .map(function(d) {
        return d.value;
      });

    ////console.log("groupData", groupData)

    var stackData = stack
      .keys(keys)(groupData)
    d3.select("#" + dataTitle).text(divText);
    //console.log("stackData", stackData)

    y.domain([0, 1500000]).nice();

    ////console.log("keys", keys)

    var serie = g.selectAll(".serie")
      .data(stackData)
      .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) {
        return z(d.key);
      });

    serie.selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter().append("rect")
      .attr("class", "serie-rect")
      .attr("transform", function(d) {
        return "translate(" + x0(d.data.MainGroup) + ",0)";
      })
      .attr("x", function(d) {
        ////console.log(d);
        return x1(d.data.SubGroup);
      })
      .attr("y", function(d) {
        ////console.log(d);
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x1.bandwidth())
      .on("click", function(d, i) {});

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 25) + ")")
        .call(d3.axisBottom(x2).ticks(d3.max(newdata,function(d){
          return +d.xlabel
        })).tickFormat(function(d){
          return xlabel[parseInt(d)]
        }));

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
          (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .text("Households");

      var legend = d3.select("#"+legendID).append("svg")
      .attr("class","stackedlegend")
      .attr("height", 140)
      .attr("width", 250)

      // legend.selectAll("legendrecs")
      //   .data(keysLegend)
      //   .enter()
      // .append("rect")
      //   .attr("x", 17)
      //   .attr("y", 8)
      //   .attr("width", 15)
      //   .attr("height", 15)
      //   .attr("stroke-width",2)
      //   .merge(legend)
      //
      // // ======== Legend text ========
      //
      // legend.selectAll("textonlegend")
      //   .data(keysLegend)
      //   .enter()
      // .append("text")
      //   .attr("x", 30)
      //   .attr("font-size",12)
      //   .attr("y", 8)
      //   .attr("dy", "0.32em");


      legend.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("class","stackeddots")
          .attr("cx", 10)
          .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill",function(d, i) { return z(i); })

      // Add one dot in the legend for each name.
      legend.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", 20)
          .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .text(function(d){ //console.log(d)
            return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .style("fill","black")

      var filtered = [];

      // Function by Andrew Reid
      // @link: https://bl.ocks.org/andrew-reid/64a6c1892d1893009d2b99b8abee75a7




    function update() {


      catInt = d3.select(catID).property('value');
      var newdata = data.filter(function(d) {
        if (d.Category == catInt) {
          return data;
        };
      });
      newdata.forEach(function(d) {
        d.Value = +d.Value;
      })

      ////console.log("data", data);
      ////console.log("data", newdata);

      x0.domain(newdata.map(function(d) {
        return d.MainGroup;
      }));
      x1.domain(newdata.map(function(d) {

          return d.SubGroup;
        }))
        .rangeRound([0, x0.bandwidth()])
        .padding(0.2);

      var x2 = d3.scaleLinear()
          .domain([0,d3.max(newdata,function(d){
            return +d.xlabel
          })]).range([40,width-30]);

      z.domain(newdata.map(function(d) {
        return d.StackGroup;
      }))

      var keys = z.domain()

      var groupData = d3.nest()
        .key(function(d) {
          return d.SubGroup + d.MainGroup;
        })
        .rollup(function(d, i) {
          //console.log(d[0].Category)
          //console.log(d)
          if (d[0].Category == catInt) {
            var d2 = {
              SubGroup: d[0].SubGroup,
              MainGroup: d[0].MainGroup
            }
          }
          d.forEach(function(d) {
            if (d.Category == catInt) {
              d2[d.StackGroup] = d.Value;
              divText = d.Title;
            }
          })
          //console.log("rollup d", d, d2);
          return d2;
        })
        .entries(newdata)
        .map(function(d) {
          return d.value;
        });

      ////console.log("groupData", groupData)

      var stackData = stack
        .keys(keys)(groupData)
      d3.select("#" + dataTitle).text(divText);
      //console.log("stackData", stackData)

      y.domain([0, 1500000]).nice();

      //console.log("keys", keys)
      g.selectAll(".serie").remove();

      var new_layer = g.selectAll(".serie")
        .data(stackData)
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {
          return z(d.key);
        });

      new_layer.selectAll("rect")
        .data(function(d) {
          return d;
        })
        .enter().append("rect")
        .attr("class", "serie-rect")
        .attr("transform", function(d) {
          return "translate(" + x0(d.data.MainGroup) + ",0)";
        })
        .attr("x", function(d) {
          ////console.log(d);
          return x1(d.data.SubGroup);
        })
        .attr("y", function(d) {
          return y(d[1]);
        })
        .attr("height", function(d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x1.bandwidth())
        .on("click", function(d, i) {});

      g.selectAll(".axis").remove();

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 25) + ")")
        .call(d3.axisBottom(x2).ticks(d3.max(newdata,function(d){
          return +d.xlabel
        })).tickFormat(function(d){
          return xlabel[parseInt(d)]
        }));

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

      //legend.selectAll("stackedlegend").remove()
      //legend.selectAll(".stackeddots").remove()
      //legend.selectAll("text").remove()

      //Update legend
      legend.selectAll(".stackedlegend")
      .attr("height", 75)
      .attr("width", 250)

      legend.selectAll("text").remove()
      legend.selectAll("mydots").remove()
      // legend.selectAll("legendrecs")
      //   .data(keysLegend)
      //   .enter()
      // .append("rect")
      //   .attr("x", 17)
      //   .attr("y", 8)
      //   .attr("width", 15)
      //   .attr("height", 15)
      //   .attr("stroke-width",2)
      //   .merge(legend)
      //
      // // ======== Legend text ========
      //
      // legend.selectAll("textonlegend")
      //   .data(keysLegend)
      //   .enter()
      // .append("text")
      //   .attr("x", 30)
      //   .attr("font-size",12)
      //   .attr("y", 8)
      //   .attr("dy", "0.32em");

      legend.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("class","stackeddots")
          .attr("cx", 10)
          .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill",function(d, i) { return z(i); })

      // Add one dot in the legend for each name.
      legend.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", 20)
          .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .text(function(d){ //console.log(d)
            return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .style("fill","black")

      var filtered = [];


    }
  });

}
