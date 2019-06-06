function make_bubble(csv_file,divID, legendID){
  var margin = {top: 40, right: 50, bottom: 60, left: 50},
      width = 900 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom;

  var svg = d3.select("#"+divID)
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(csv_file, function(data) {

    console.log(data)
    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // Add X axis
    var x = d3.scaleLinear()
      .domain([d3.min(data, function(d){
        return(d.xValue);
      }), 1200000])
      .range([ 80, width]);

    // svg.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x).ticks(6));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+50 )
        .text("Number of Households");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0,4])
      .range([ height, 0]);
    //
    // svg.append("g")
    //   .call(d3.axisRight(y)
    //   .tickSize(width)
    //   .ticks(4))

    var xAxis = d3.axisBottom(x)
    .ticks(6);

    var yAxis = d3.axisRight(y)
        .ticks(3)
        .tickSize(width)
        .tickFormat(function(d) {
          var s = d;
          return this.parentNode.nextSibling
              ? "\xa0" + s
              :  s;
        });

    svg.append("g")
        .call(customYAxis);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(customXAxis);


    function customYAxis(g) {
      g.call(yAxis);
      g.select(".domain").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    }

    function customXAxis(g) {
      g.call(xAxis);
      g.select(".domain").remove();
    }

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20 )
        .text("Number of Adults Per Household")
        .attr("text-anchor", "start")


    // Add a scale for bubble size
    var z = d3.scaleSqrt()
      .domain([0, 3])
      .range([10, 50]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
      .domain(["Observed", "Modeled"])
      .range(['#5cbddd','#1c5f83']);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#"+divID)
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html(d.yValue + " Adult households with " + d.magnitude + " children")
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")

    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }


    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function(d){
      // reduce opacity of all groups
      d3.selectAll(".bubbles").style("opacity", .05)
      // expect the one that is hovered
      d3.selectAll("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".bubbles").style("opacity", .8)
    }


    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", function(d) { return "bubbles " + d.SubGroup })
        .attr("cx", function (d) { return x(parseFloat(d.xValue)); } )
        .attr("cy", function (d) { return y(parseFloat(d.yValue)); } )
        .attr("r", function (d) { return z(parseFloat(d.magnitude)); } )
        .style("fill", function (d) { return myColor(d.SubGroup); } )
        .style("opacity",.8)
      // -3- Trigger the functions for hover
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )

      var yAxis = d3.axisRight(y)
        .tickSize(width)
        .tickFormat(function(d) {
          var s = formatNumber(d / 1e6);
          return this.parentNode.nextSibling
              ? "\xa0" + s
              :  s + " Adults";
        });


      // ---------------------------//
      //       LEGEND              //
      // ---------------------------//
      var legendsvg = d3.select("#"+legendID).append("svg")
      .attr("height", 210)
      .attr("width", 250)


      // Add legend: circles
      var valuesToShow = [0,1,2]
      var xCircle = 390
      var xLabel = 440
      legendsvg
        .selectAll("legendcat")
        .data(valuesToShow)
        .enter()
        .append("circle")
          .attr("cx", 45)
          .attr("cy", function(d){ return 170 - z(d) } )
          .attr("r", function(d){ return z(d) })
          .style("fill", "none")
          .attr("stroke", "black")

      // Add legend: segments
      legendsvg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
          .attr('x1', function(d){ return 45 + z(d) } )
          .attr('x2', function(d){ return 80 + z(d) })
          .attr('y1', function(d){ return 170 - z(d) } )
          .attr('y2', function(d){ return 170 - z(d) } )
          .attr('stroke', 'black')
          .style('stroke-dasharray', ('2,2'))

      // Add legend: labels
      legendsvg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
          .attr('x', function(d){ return 80 + z(d) })
          .attr('y', function(d){ return 170 - z(d) } )
          .text( function(d){ return d  + " Children"} )
          .style("font-size", 12)
          .attr('alignment-baseline', 'middle')

      // Legend title
      legendsvg.append("text")
        .attr('x', xCircle)
        .attr("y", height - 100 +30)
        .text("Number of Children")
        .attr("text-anchor", "middle")
        // Add one dot in the legend for each name.
        var size = 20
        var allgroups = ["Observed", "Modeled"]
    var color = d3.scaleOrdinal()
      .domain(allgroups)
      .range(['#5cbddd','#1c5f83','#66666E','#fefefe','#7ebea5','#3c765f','#EFE9AE','#AFBE8F']);



      legendsvg.selectAll("mydots")
        .data(allgroups)
        .enter()
        .append("circle")
          .attr("cx", 10)
          .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill",  function(d){ return color(d)})
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

      // Add labels beside legend dots
      legendsvg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
          .attr("x", 20)
          .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)
    })

}
