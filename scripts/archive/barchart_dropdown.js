function makeGroupChart(csv_file,chartID,catID,checkBoxID, nogroups){

  var ngroups= nogroups+1
  var formatValue = d3.format(".2s");

  var margin = {top: 35, right: 80, bottom: 35, left: 45},
    width = 650 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var g = d3.select(chartID).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
    x1 = d3.scaleBand(),
    y = d3.scaleLinear().rangeRound([height, 0]);

  let xAxis = d3.axisBottom(x0),
    yAxis = d3.axisLeft(y).ticks(null, "s");

  g.append("g")
  .attr("class","axis axis--x")
  .attr("transform", "translate(0," + height + ")");

  g.append("g")
  .attr("class", "axis axis--y");

  var z = d3.scaleOrdinal()
  .range(["#2E4257","#2A697C","#159398","#20BEA7","#5BE8A7","#23202F"]);

  var durations = 0;

  let afterLoad = () => durations = 750;

  var catInt, keys, copy, sortIndex;

  var keysLegend = [];

  //makeChart();
  d3.queue()
  .defer(d3.csv, csv_file, function(d, i, columns) {
    for(var i = 1, ttl = 0, n = columns.length; i < n; ++i)
      ttl += d[columns[i]] = +d[columns[i]];
      d.total = ttl;
      return d;
  })
  .await(function(error, data){
    if (error) throw error;

    d3.select(catID).on('change', update);
    d3.select(checkBoxID).on('change', update); // Sort checkbox

    init();
    update();

    function init() {
      sortIndex = data.map( function(d) { return d.Index} );
    }

    function update() {

      // ======== Initial/Sliced values ========

      catInt = d3.select(catID).property('value');

      keys = data.columns.slice(1, ngroups); //Filter columns for Group Labels

      copy = [];

      keys.forEach(function(t) {
        t = t.slice(0,-2)    //Slice column label to select subgroup
        copy.push(t)
      })

      var copyKeys = keys;

      keysLegend = []

      copyKeys.forEach(function(s) {
        s = s.slice(0, -2)  //Slice column label to select subgroup
        keysLegend.push(s + catInt)
      })

      data.forEach(function(d, i, columns) {
        for (var i = 1, test = 0, n = keysLegend.length; i < n; ++i)
          test += d[keysLegend[i]] = +d[keysLegend[i]];
          d.totalSlice = test;
          console.log("Group Total: ", d.totalSlice)
          return d;
      })

      // ======== Domain, Axis & Sort ========

      y.domain([0, d3.max(data, function(d) {
        return d3.max(copy, function(key) {
          return d[key+catInt];
          });
        })
      ]).nice();

      g.selectAll(".axis.axis--y").transition()
        .duration(durations)
        .call(yAxis);

      var barGroups = g.selectAll(".layer") // Bargroups initialized here for proper sorting
        .data(data, function(d) { return d.Index }); // DON'T FORGET KEY FUNCTION

      barGroups.enter().append("g")
        .classed('layer', true);

      barGroups.exit().remove();

      data.sort( d3.select(checkBoxID).property("checked")
        ? function(a, b) {
          return b.totalSlice - a.totalSlice;
        }
        : function(a, b) {
          return sortIndex.indexOf(a.Index) - sortIndex.indexOf(b.Index);
        });

      x0.domain(data.map(function(d) { return d.Index; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);

      g.selectAll(".axis.axis--x").transition()
        .duration(durations)
        .call(xAxis);

      // ======== Grouped bars ========

      g.selectAll(".layer").transition().duration(durations)
        .attr("transform", function(d, i) {
          return "translate(" + x0(d.Index) + ",0)";
        });

      let bars = g.selectAll(".layer").selectAll("rect")
        .data(function(d) {
          return copy.map(function(key) {
            return {key: key+catInt, value: d[key+catInt]};
          });
        });

      bars = bars
        .enter()
      .append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(d.key); })
        .attr("fill", function(d) { return z(d.key); })
        .merge(bars);

      bars.transition().duration(durations)
        .attr("y", function(d) { return y(d["value"]); })
        .attr("height", function(d) { return height - y(d["value"]); });

      // ======== Grouped bar text ========

      let textOnBar = g.selectAll(".layer").selectAll("text")
        .data(function(d) {
          return copy.map(function(key) {
            return {key: key+catInt, value: d[key+catInt]};
          });
        });

      textOnBar = textOnBar
        .enter()
      .append("text")
        .attr("fill","#fff")
        .attr("font-size",11)
        .merge(textOnBar);

      textOnBar.transition().duration(durations)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 7,
              y0 = y(d.value) + 8;
          return "translate(" + x0 + "," + y0 + ") rotate(90)";
        })
        .text(function(d) {return formatValue(d.value)})

      // ======== Legend rects ========

      var legend = g.selectAll(".legend")
        .data(keysLegend);

      legend = legend
        .enter()
      .append("rect")
        .attr("class","legend")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 40 + ")";
        })
        .attr("x", width + 17)
        .attr("width", 15)
        .attr("height", 15)
        .attr("stroke-width",2)
        .on("click",function(d) {
          console.log(d)
          updateLegend(d)
        })
        .merge(legend)

      legend.transition().duration(durations)
        .attr("fill", z)
        .attr("stroke", z);

      // ======== Legend text ========

      var legendText = g.selectAll(".legendText")
        .data(keysLegend);

      legendText = legendText
        .enter()
      .append("text")
        .attr("class","legendText")
        .attr("transform", function(d, i) {
          return "translate(0," + i * 40 + ")";
        })
        .attr("x", width + 40)
        .attr("font-size",12)
        .attr("y", 8)
        .attr("dy", "0.32em")
        .merge(legendText);

      legendText.transition().duration(durations)
        .text(function(d) {
          var sliceLegend = d.slice(0, -2)
          return sliceLegend;
        });

    } // End of update function

    var filtered = [];

    // Function by Andrew Reid
    // @link: https://bl.ocks.org/andrew-reid/64a6c1892d1893009d2b99b8abee75a7

    function updateLegend(d) {

      d3.select(".clickThis").style("display","none")

      if (filtered.indexOf(d) == -1) {
        filtered.push(d);

        if(filtered.length == keysLegend.length) filtered = [];
      }

      else {
        filtered.splice(filtered.indexOf(d), 1);
      }

      var newKeys = [];
      keysLegend.forEach(function(d) {
        if (filtered.indexOf(d) == -1 ) {
          newKeys.push(d);
        }
      })

      x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);

      y.domain([0, d3.max(data, function(d) {
        return d3.max(keysLegend, function(key) {
          if (filtered.indexOf(key) == -1)
            return d[key];
          });
        })
      ]).nice();

      g.select(".axis--y")
        .transition()
        .duration(durations/1.5)
        .call(yAxis);

      var barsLegend = g.selectAll(".layer").selectAll("rect")
        .data(function(d) {
          return keysLegend.map(function(key) {
            return {key: key, value: d[key]};
          });
        })

      barsLegend.filter(function(d) {
           return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("x", function(d) {
          return (+d3.select(this).attr("x")) +
                 (+d3.select(this).attr("width"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("y", function(d) { return height; });

      barsLegend.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("fill", function(d) { return z(d.key); });

      var barsLegendText = g.selectAll(".layer").selectAll("text")
        .data(function(d) {
          return keysLegend.map(function(key) {
            return {key: key, value: d[key]};
          });
        })

      barsLegendText.filter(function(d) {
           return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 7,
              y0 = y(d.value) + 8;
          return "translate(" + x0 + "," + y0 + ") rotate(90)";
        })
        .text("");

      barsLegendText.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 7,
              y0 = y(d.value) + 8;
          return "translate(" + x0 + "," + y0 + ") rotate(90)";
        })
        .text(function(d) {return formatValue(d.value)})

      g.selectAll(".legend")
        .transition()
        .duration(100)
        .attr("fill",function(d) {
          if (filtered.length) {
            if (filtered.indexOf(d) == -1) {
              return z(d);
            } else {
              return "white"; }
            } else {
            return z(d);
          }
        });

    } // End of updateLegend

    afterLoad();

  // End of ready
  });}
