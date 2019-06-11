function make_heatmap(csv_file,divID, divID2, divLegend){
  /*

     negative color scales in increasing magnitude
     #EF9FAE, #C76475, #781426

     positive color scales in increasing magnitude
     #ABDB92, #77B75B, #2E6E12

     */

     /* supporting functions */

     // Standard deviation
     function RMS(arr){
         return Math.pow(arr.reduce(function(acc,pres){
             return acc+ Math.pow(pres,2);
         })/arr.length,.5)
     }

     // mean
     function mean(arr){
         return arr.reduce(function(acc,prev){
             return acc+prev;
         })/arr.length;
     }

   var lPatchWidth=200;
   var itemSize = 65,
       cellSize = itemSize - 6,
       margin = {top: 10, right: 50, bottom: 120, left: 110};

     var data;

   var width = 700 - margin.right - margin.left,
       height = 425 - margin.top - margin.bottom;
   var colorScale;

   colorHold=['#051937', '#004d7a', '#008793', '#00bf72', '#a8eb12','#E8FBBC']
   colorLText=["< 5%","10% to 15%","20% to 25%","30% to 35%","40% to 45%","> 55%"]

   function bandClassifier(val,multiplier)
   {
         if(val>=0)
         {
             return (Math.floor((val*multiplier)/(.33*multiplier))+1)>3?3:Math.floor((val*multiplier)/(.33*multiplier))+1
         }
         else{
             return (Math.floor((val*multiplier)/(.33*multiplier)))<-3?-3:Math.floor((val*multiplier)/(.33*multiplier))
         }
   }


   window.onload=function(){
       d3.csv(csv_file, function ( response ) {

      make_map(divID, 'observed')
      make_map(divID2, 'modeled')

    function make_map(chartid, dtype){
      // Finding the mean of the data
      data = response.map(function( item ) {
          var newItem = {};
          newItem.country = item.x;
          newItem.product = item.y;

          if(dtype == 'observed'){
            newItem.value = +item.observed
          }
          if(dtype == 'modeled'){
            newItem.value =  +item.modeled
          }
          return newItem;
      })

      //console.log(data)


      invertcolors=0;
      // Inverting color scale
      if(invertcolors){
          colorHold.reverse();
      }

      var x_elements = d3.set(data.map(function( item ) { return item.product; } )).values(),
          y_elements = d3.set(data.map(function( item ) { return item.country; } )).values();

      var xScale = d3.scaleBand()
          .domain(x_elements)
          .range([0, x_elements.length * itemSize])
          .paddingInner(20).paddingOuter(cellSize/2)

      var xAxis = d3.axisBottom()
          .scale(xScale)
          .tickFormat(function (d) {
              return d;
          });

      var yScale = d3.scaleBand()
          .domain(y_elements)
          .range([0, y_elements.length * itemSize])
          .paddingInner(.2).paddingOuter(.2);

      var yAxis = d3.axisLeft()
          .scale(yScale)
          .tickFormat(function (d) {
              return d;
          });


      colorScale = d3.scaleOrdinal()
          .domain([-3,-2,-1,1,2,3])
          .range(colorHold);

      var mean=d3.mean(data.map(function(d){
        return +d.value
      }));

      //setting percentage change for value w.r.t average
      data.forEach(function(d){
          d.perChange=(d.value-mean)/mean
      })

      var rootsvg = d3.select('#'+chartid)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)


      var svg=rootsvg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // tooltip
      tooltip=d3.select("body").append("div").style("width","100px").style("height","60px").style("background","white")
      .style("opacity","1").style("position","absolute").style("visibility","hidden").style("box-shadow","0px 0px 6px #7861A5").style("padding","10px");
      toolval=tooltip.append("div");


      var cells = svg.selectAll('rect')
          .data(data)
          .enter().append('g').append('rect')
          .attr('class', 'cell')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('y', function(d) { return yScale(d.country); })
          .attr('x', function(d) { return xScale(d.product)-cellSize/2; })
          .attr('fill', function(d) { return colorScale(bandClassifier(d.perChange,100));})
          .attr('stroke','white')
          .style("stroke-width","2px")
          .attr("rx",3)
          .attr("ry",3)
          .on("mouseover",function(d){
              //console.log(d);
              //d3.select(this).attr("fill","#655091");
              d3.select(this).style("stroke","orange").style("stroke-width","3px")
              d3.select(".trianglepointer").transition().delay(100).attr("transform","translate("+(-((lPatchWidth/colorScale.range().length)/2+(colorScale.domain().indexOf(bandClassifier(d.perChange,100))*(lPatchWidth/colorScale.range().length) )))+",0)");

              //d3.select(".LegText").select("text").text(colorLText[colorScale.domain().indexOf(bandClassifier(d.perChange,100))])
             d3.select(".LegText").select("text").text(d.value+"%")

          })
          .on("mouseout",function(){
              //d3.select(this).attr('fill', function(d) { return colorScale(window.bandClassifier(d.perChange,100));});
              d3.select(this).style("stroke","none");
              tooltip.style("visibility","hidden");

              d3.select(this)
              .style('stroke','white')
              .style("stroke-width","2px")
          })
          .on("mousemove",function(d){
              tooltip.style("visibility","visible")
              .style("top",(d3.event.pageY-30)+"px").style("left",(d3.event.pageX+20)+"px");

              //console.log(d3.mouse(this)[0])
              tooltip.select("div").html("<strong>"+d.product+"</strong><br/> "+(+d.value).toFixed(2))

          })

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .selectAll('text')
              .attr('font-weight', 'normal');

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform","translate(0,"+(y_elements.length * itemSize +cellSize/2)+")")
              .call(xAxis)
              .selectAll('text')
              .attr('font-weight', 'normal')
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.5em")
              .attr("transform", function (d) {
                  return "rotate(-65)";
              });
    }

    var legendwidth = 250,
        legendheight = 50;

    var legends = d3.select("#"+divLegend).append("svg")
    .attr("height", legendheight)
    .attr("width", legendwidth)
    //.attr("transform","translate("+((legendwidth+margin.right)/2-lPatchWidth/2 -margin.left/2)+","+(legendheight+margin.bottom-35-20)+")");

     // Legend traingle pointer generator
     var symbolGenerator = d3.symbol()
     .type(d3.symbolTriangle)
     .size(64);

     legends.append("g").attr("transform","rotate(180)").append("g").attr("class","trianglepointer")
     .attr("transform","translate("+(-lPatchWidth/colorScale.range().length)/2+")")
     .append("path").attr("d",symbolGenerator());
     //Legend Rectangels
     legends.append("g").attr("class","LegRect")
     .attr("transform","translate(0,"+15+")")
     .selectAll("rect").data(colorScale.range()).enter()
     .append("rect").attr("width",lPatchWidth/colorScale.range().length+"px").attr("height","10px").attr("fill",function(d){ return d})
     .attr("x",function(d,i){ return i*(lPatchWidth/colorScale.range().length) })

     // legend text
     legends.append("g").attr("class","LegText")
     .attr("transform","translate(0,45)")
     .append("text")
     .attr("x",lPatchWidth/2)
     .attr('font-weight', 'normal')
     .style("text-anchor", "middle")
     .text(colorLText[0])

     // Heading
     // rootsvg.append("g")
     // .attr("transform","translate(0,30)")
     // .append("text")
     // .attr("x",(width+margin.right+margin.left)/2)
     // .attr('font-weight', 'bold')
     // .attr('font-size', '22px')
     // .attr('font-family', 'Segoe UI bold')
     // .style("text-anchor", "middle")
     // .text("Sales Heatmap")


   });
   }
}
