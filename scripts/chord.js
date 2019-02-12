function chord(labels,matrix,colors,loc){
  var chord = d3.layout.chord()
      .padding(.04)
      .sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
      .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
  	.matrix(matrix);

  var width = 200,
      height = 200,
      innerRadius = Math.min(width, height) * .41,
      outerRadius = innerRadius * 1.05;

  var fill = d3.scale.ordinal()
      .domain(d3.range(labels.length))
      .range(colors);

  var arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

  var svg = d3.select(loc).append("svg:svg")
      .attr("width", width)
      .attr("height", height+50)
  	.append("svg:g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2+30) + ")");

  ////////////////////////////////////////////////////////////
  ////////////////// Draw outer Arcs /////////////////////////
  ////////////////////////////////////////////////////////////

  var g = svg.selectAll("g.group")
  	.data(chord.groups)
  	.enter().append("svg:g")
  	.attr("class", "group")
  	.on("mouseover", fade(.02))
  	.on("mouseout", fade(.80));

  g.append("svg:path")
    .style("stroke", function(d) { return fill(d.index); })
    .style("fill", function(d) { return fill(d.index); })
    .attr("d", arc);

  ////////////////////////////////////////////////////////////
  ////////////////// Append Ticks ////////////////////////////
  ////////////////////////////////////////////////////////////

  // var ticks = svg.append("svg:g").selectAll("g.ticks")
  //     .data(chord.groups)
  // 	.enter().append("svg:g").selectAll("g.ticks")
  // 	.attr("class", "ticks")
  //     .data(groupTicks)
  // 	.enter().append("svg:g")
  //     .attr("transform", function(d) {
  //       return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
  //           + "translate(" + outerRadius+40 + ",0)";
  //     });
  //
  // ticks.append("svg:line")
  //     .attr("x1", 1)
  //     .attr("y1", 0)
  //     .attr("x2", 5)
  //     .attr("y2", 0)
  //     .style("stroke", "#000");
  //
  // ticks.append("svg:text")
  //     .attr("x", 8)
  //     .attr("dy", ".35em")
  //     .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
  //     .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
  //     .text(function(d) { return d.label; });

  ////////////////////////////////////////////////////////////
  ////////////////// Append Names ////////////////////////////
  ////////////////////////////////////////////////////////////

  g.append("svg:text")
    .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("class", "titles")
    .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .attr("transform", function(d) {
  		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
  		+ "translate(" + (innerRadius + 10) + ")"
  		+ (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .text(function(d,i) { return labels[i]; });

  ////////////////////////////////////////////////////////////
  ////////////////// Draw inner chords ///////////////////////
  ////////////////////////////////////////////////////////////

  svg.selectAll("path.chord")
  	.data(chord.chords)
  	.enter().append("svg:path")
  	.attr("class", "chord")
  	.style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
  	.style("fill", function(d) { return fill(d.source.index); })
  	.attr("d", d3.svg.chord().radius(innerRadius));

  ////////////////////////////////////////////////////////////
  ////////////////// Extra Functions /////////////////////////
  ////////////////////////////////////////////////////////////

  // Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return function(d, i) {
      svg.selectAll("path.chord")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
  		.transition()
          .style("stroke-opacity", opacity)
          .style("fill-opacity", opacity);
    };
  }//fade

  // Returns an array of tick angles and labels, given a group.
  // function groupTicks(d) {
  //   var k = (d.endAngle - d.startAngle) / d.value;
  //   return d3.range(0, d.value, 1).map(function(v, i) {
  //     return {
  //       angle: v * k + d.startAngle,
  //       label: i % 5 ? null : v + "%"
  //     };
  //   });
  // }//groupTicks

  return svg
}
