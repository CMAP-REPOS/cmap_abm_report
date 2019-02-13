function barStack(d) {
var l = d[0].length
while (l--) {
	var posBase = 0, negBase = 0;
	d.forEach(function(d) {
		d=d[l]
		d.size = Math.abs(d.y)
		if (d.y<0)  {
			d.y0 = negBase
			negBase-=d.size
		} else
		{
			d.y0 = posBase = posBase + d.size
		}
	})
}
d.extent= d3.extent(d3.merge(d3.merge(d.map(function(e) { return e.map(function(f) { return [f.y0,f.y0-f.size]})}))))
return d
}

d3.csv("data.csv",function(csv) {
initialData = csv;
makeBars();
});

function makeBars() {

	d3.select("#chart svg")
	.remove();

	var selectedNaics = document.getElementById("menu").value;
	var filteredData = initialData.filter(function(d) { return d.naics == selectedNaics; });
	var data = ["exports","imports"].map(

	function(v){
		return filteredData.map(function(d){
        return  {y: d[v]}
		});
	});

	var margin = {top: 0, right: 0, bottom: 0, left: 50},
		height=400,
		width=745,
		color = d3.scale.ordinal().range(["#3498DB","#2980B9"]);

	xScale = d3.scale.ordinal()
		.domain(filteredData.map(function(d){return d.year}))
		.rangeRoundBands([0,width - margin.left - margin.right], .1);

	yScale = d3.scale.linear()
		.range([height - margin.top - margin.bottom,0]);

	xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
	yAxis = d3.svg.axis().scale(yScale).orient("right").tickSize(width - margin.left - margin.right);

	barStack(data)
	console.log
	yScale.domain(data.extent)

	var line = d3.svg.line()
		.x(function(d) { return xScale(d.year)+xScale.rangeBand()/2; })
		.y(function(d) { return yScale(d.netexports); });

	var svg = d3.select("#chart")
		.append("svg")
		.style("padding","5px")
		.attr("height",height)
		.attr("width",width);

	svg.selectAll(".series")
		.data(data)
		.enter().append("g")
		.attr("class", "series")
		.style("fill", function(d,i) { return color(i)});

	var bars = svg.selectAll(".series").selectAll("rect")
		.data(Object);

	bars.enter().append("rect")
		.attr("x",function(d,i) { return xScale(xScale.domain()[i])})
		.attr("y",function(d) { return yScale(d.y0) + 0})
		.attr("height",function(d) { return yScale(0)-yScale(d.size)})
		.attr("width",xScale.rangeBand())
		.attr("class", "bar");

	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate (0 "+yScale(0)+")")
		.call(xAxis);

	svg.append("g")
		.attr("class","y axis")
		.attr("transform", "translate(0," + yScale.range()[1] + 0 + ")")
		.call(yAxis)
		.append("text")
			.attr("class", "ylabel")
			.attr("transform", "rotate(-90)")
			.attr("y", width-10)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("$US Billions");

	svg.selectAll("g")
		.classed("g-baseline", function(d) { return d == 0 });

	svg.append("path")
		.datum(filteredData)
		.attr("class", "line")
		.attr("d", line);

	svg.append("text")
		.attr("class", "keylabel")
		.attr("x", 15)
		.attr("y", -5)
		.attr("dy", ".71em")
		.text("Exports");

	svg.append("rect")
		.attr("width", 11)
		.attr("height", 11)
		.attr("x", 0)
		.attr("y", -5)
		.style("fill", "#3498DB");

	svg.append("text")
		.attr("class", "keylabel")
		.attr("x", 87)
		.attr("y", -5)
		.attr("dy", ".71em")
		.text("Imports");

	svg.append("rect")
		.attr("width", 11)
		.attr("height", 11)
		.attr("x", 72)
		.attr("y", -5)
		.style("fill", "#2980B9");

};

d3.select(self.frameElement).style("height", "585px");
