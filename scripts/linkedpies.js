// adapted from: https://stackoverflow.com/questions/35090256/mouseover-event-on-two-charts-at-the-same-time-d3-js

// TODO: get data from .csvs
var data2 = [{
    label: 'discretionary',
    count: 3376778
  }, {
    label: 'eatingout',
    count: 2535581
  }, {
    label: 'escort',
    count: 4068983
  },{
      label:'maintenance',
      count: 4689505
  },{
      label:'school',
      count:2514119
  },{
    label:'shop',
    count:5555766
  },{
      label:'university',
      count:333811
  },{
      label:'visiting',
      count:2019572
  },{
      label:'work',
      count:5585820
  },{
      label:'work-based',
      count:961958
  }];

  var data1 = [{
    label: 'discretionary',
    count: 3329460
  }, {
    label: 'eatingout',
    count: 2358465
  }, {
    label: 'escort',
    count: 3572470
  },{
      label:'maintenance',
      count: 4071820
  },{
      label:'school',
      count:2673570
  },{
    label:'shop',
    count:5654030
  },{
      label:'university',
      count:380805
  },{
      label:'visiting',
      count:1936195
  },{
      label:'work',
      count:6223375
  },{
      label:'work-based',
      count:945640
  }];

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
    range(["#543005",
    "#8c510a",
    "#bf812d",
    "#dfc27d",
    "#f6e8c3",
    "#c7eae5",
    "#80cdc1",
    "#35978f",
    "#01665e",
    "#003c30"]).
    domain(d3.keys(data[0]).filter(function(key) {
      return key === 'label';
    }));


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
      .attr('class', 'tooltip')
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
        return d.data.label;
      }).
      style('fill', function(d, i) {
        return color(d.data.label);
      }).
      on('mouseover', function(d0) {
        d3.selectAll('path')
            .style("opacity",1);
        d3.selectAll('path.' + d0.data.label).transition()
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
            tooltip.select('.label').html(d1.data.label);
            tooltip.select('.count').html(formatComma(d1.data.count));
            tooltip.select('.percent').html(percent + '%');
            tooltip
            .style('display', 'block')

          })
    }).
    on('mouseout', function(d) {
        d3.selectAll('path')
            .style("opacity",1);
      d3.selectAll('path.' + d.data.label).transition()
        .duration(500)
        .attr("d", arc);
      d3.selectAll('.tooltip').style('display', 'none');
    });
    return path;
  };
  drawPieChartFunction(data1, '#pieChart1', 'tooltip1');
  drawPieChartFunction(data2, '#pieChart2', 'tooltip2');
