function make_h_stacked(csv_file,divID, legendID){
  var margin = {top: 35, right: 10, bottom: 100, left: 50},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


  var g = d3.select("#"+divID).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        var y = d3.scaleBand()
            .rangeRound([0, 200])
            .padding(0.1)
            .align(0.1);

        var x = d3.scaleLinear()
            .rangeRound([700, 0]);

        var z = d3.scaleOrdinal()
            .range(['#02CA22', '#FB5652', '#FFB005']);

        var stack = d3.stack()
            .offset(d3.stackOffsetExpand);

        d3.csv(csv_file, type, function (error, data) {
            if (error) throw error;

            /*data.sort(function(a, b) {
              return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total;
            });*/

            y.domain(data.map(function (d) {
                return d.State;
            }));
            z.domain(data.columns.slice(1));

            var serie = g.selectAll(".serie")
                .data(stack.keys(data.columns.slice(1))(data))
                .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function (d) {
                    return z(d.key);
                });

            var bar = serie.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("y", function (d) {
                    return y(d.data.State);
                })
                .attr("x", function (d) {
                    return x(d[1]);
                })
                .attr("width", function (d) {
                    return x(d[0]) - x(d[1]);
                })
                .attr("height", y.bandwidth());

            bar.append("text")
                .attr("x", function (d) {
                    return x(d[1]);
                })
                .attr("dy", "1.35em")
                .text(function (d) { return d; });


            /* g.append("g")
               .attr("class", "axis axis--x")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x).ticks(2, "%"));*/

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y));

            var legend = serie.append("g")
                .attr("class", "legend")
                .attr("transform", function (d) {
                    var d = d[0];
                    return "translate(" + ((x(d[0]) + x(d[1])) / 2) + ", " + (y(d.data.State) - y.bandwidth()) + ")";
                });

            /*legend.append("line")
                .attr("y1", 5)
                .attr("x1", 15)
                .attr("x2", 15)
                .attr("y2", 12)
                .attr("stroke", "#000");

            legend.append("text")
                .attr("x", 9)
                .attr("dy", "0.35em")
                .attr("fill", "#000")
                .style("font", "10px sans-serif")
                .text(function (d) {
                    return d.key;
                }); */
        });

        function type(d, i, columns) {
            var t;
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.total = t;
            return d;
        }
}
