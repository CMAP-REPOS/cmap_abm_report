// adapted from: https://stackoverflow.com/questions/35090256/mouseover-event-on-two-charts-at-the-same-time-d3-js

// data
d3.csv("data/csv13_model_trip_mode.csv", function(data) {
  var data2 = [];

  for (var i = 0; i < data.length; i++) {
  data2.push({selectorid: data[i].selectorid,
                count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_mode})
}
  drawPieChartFunction(data2, '#pieMode2', 'tooltip2');

});

d3.csv("data/csv14_survey_trip_mode.csv", function(data) {
  var data1 = [];

  for (var i = 0; i < data.length; i++) {
  data1.push({selectorid: data[i].selectorid,
                count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_mode})
}
  drawPieChartFunction(data1, '#pieMode1', 'tooltip1');
});

d3.csv("data/csv15_survey_trip_purpose.csv", function(data) {
  var data3 = [];

  for (var i = 0; i < data.length; i++) {
  data3.push({selectorid: data[i].selectorid,
                count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_purpose})
}
  drawPieChartFunction(data3, '#piePurpose1', 'tooltip3');

});

d3.csv("data/csv16_model_trip_purpose.csv", function(data) {
  var data4 = [];

  for (var i = 0; i < data.length; i++) {
  data4.push({selectorid: data[i].selectorid,
                count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_purpose})
}
  drawPieChartFunction(data4, "#piePurpose2", 'tooltip4');
});

d3.csv("data/csv17_model_transit_access.csv", function(data) {
  var data5 = [];

  for (var i = 0; i < data.length; i++) {
  data5.push({selectorid: data[i].selectorid,
                count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_mode})
}
  drawPieChartFunction(data5, "#pieTransitModelMode", 'tooltip5');
});

d3.csv("data/csv18_survey_transit_access.csv", function(data) {
  var data6 = [];

  for (var i = 0; i < data.length; i++) {
  data6.push({selectorid: data[i].selectorid,
              count: parseInt(data[i].QUANTITY, 10),
              label: data[i].trip_mode})
}
  drawPieChartFunction(data6, "#pieTransitSurveyMode", 'tooltip6');
});

// chart
  var formatComma = d3.format(",");
  var drawPieChartFunction = function(data, chartId, tooltipName) {

    var margin = {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width = 400 - margin.right - margin.left,
      height = 400 - margin.top - margin.bottom;

    var radius = Math.min(width/1.5, height/1.5) / 2;
    var donutWidth = 55;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.
    scaleOrdinal().
    range(['#ABABAB',
    '#1C4E80',
    '#6A9BCC',

    '#CFCFCF',
    '#ABABAB',
    '#595959',
    
    '#821E20',
    '#CF4446',
    
    '#D7D55C',
    '#8A882D',
    
    '#081D58'
    ]).
    domain(d3.keys(data[0]).filter(function(key) {
      return key === 'selectorid';
    }));

    console.log(color);


    // like the canvas
    var svg = d3.select(chartId).append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + ((width + margin.right + margin.left) / 2) +
      ',' + ((250 + margin.top + margin.bottom) / 2) + ')');

    // arc is path generator
    var arc = d3.arc().
    innerRadius(radius - donutWidth).
    outerRadius(radius);

    var arcHover = d3.arc().
    innerRadius(radius - donutWidth).
    outerRadius(radius + 10);

    var pie = d3.pie().
    value(function(d) {
      return d.count;
    });

    var tooltip = d3.select(chartId)
      .append('div')
      .attr('class', 'modepurposetooltip')
      .attr('id', tooltipName)
      .style('opacity', 1);
    tooltip.append('div')
      .attr('class', 'label');
    tooltip.append('div')
      .attr('class', 'count');
    tooltip.append('div')
      .attr('class', 'percent');

    var path = svg.selectAll('path').
      data(pie(data)).
      enter().
      append('path').
      attr('d', arc).
      attr('class', function(d) {
        return d.data.selectorid;
      }).
      style('fill', function(d, i) {
        return color(d.data.selectorid);
      }).
      on('mouseover', function(d0) {
        d3.selectAll('path').transition()
            .style("opacity",0.5)
        d3.selectAll('path.' + d0.data.selectorid).transition()
           .style("opacity",1)
          .duration(500)
          .attr("d", arcHover)
          .each(function(d1) {
            var total = d3.sum(data, function(d2) {
              return d2.count;
            });
            var percent = (100 * d1.value / total).toPrecision(3);

            // find correct tooltip
            var tooltip = d3.select(this.ownerSVGElement.parentNode.childNodes[1]);
            tooltip.select('.label').html("<font color = 'black'>" + d1.data.label + "</font>");
            tooltip.select('.count').html(formatComma(d1.data.count));
            tooltip.select('.percent').html(percent + '%');
            tooltip
            .style('display', 'block')

          })
    }).
    on('mouseout', function(d0) {
        d3.selectAll('path').transition()
            .style("opacity",1)
      d3.selectAll('path.' + d0.data.selectorid).interrupt()
        .attr('d', arc)
        .style("opacity",1);
      // d3.selectAll('.tooltip').style('display', 'none');
    });
    return path;
  };
