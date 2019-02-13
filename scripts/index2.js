d3.json("matrix.json", function(matrix) {

// Compute the chord layout.
layout.matrix(matrix);

// Add a group per neighborhood.
var group = svg.selectAll(".group")
.data(layout.groups)
.enter().append("g")
.attr("class", "group")
.on("mouseover", mouseover);

// Add a mouseover title.
// group.append("title").text(function(d, i) {
// return cities[i].name + ": " + formatPercent(d.value) + " of origins";
// });

// Add the group arc.
var groupPath = group.append("path")
.attr("id", function(d, i) { return "group" + i; })
.attr("d", arc)
.style("fill", function(d, i) { return cities[i].color; });

// Add a text label.
var groupText = group.append("text")
.attr("x", 6)
.attr("dy", 15);

groupText.append("textPath")
.attr("xlink:href", function(d, i) { return "#group" + i; })
.text(function(d, i) { return cities[i].name; });

// Remove the labels that don't fit. :(
groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
.remove();

// Add the chords.
var chord = svg.selectAll(".chord")
.data(layout.chords)
.enter().append("path")
.attr("class", "chord")
.style("fill", function(d) { return cities[d.source.index].color; })
.attr("d", path);

// Add an elaborate mouseover title for each chord.
 chord.append("title").text(function(d) {
 return cities[d.source.index].name
 + " → " + cities[d.target.index].name
 + ": " + formatPercent(d.source.value)
 + "\n" + cities[d.target.index].name
 + " → " + cities[d.source.index].name
 + ": " + formatPercent(d.target.value);
 });

function mouseover(d, i) {
chord.classed("fade", function(p) {
return p.source.index != i
&& p.target.index != i;
});
}
});
});
