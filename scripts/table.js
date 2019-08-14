//d3.json('data/data.json', function (error,data) {

var formatComma = d3.format(","),
    formatDecimal = d3.format(".1f"),
    formatDecimalComma = d3.format(",.0f"),
    formatSuffix = d3.format("s"),
    formatSuffixDecimal1 = d3.format(".1s"),
    formatSuffixDecimal2 = d3.format(".2s"),
    formatMoney = function(d) { return "$" + formatDecimalComma(d); },
    formatPercent = d3.format(",.1%");

var isNumeric = function (n) {
		    return !isNaN(parseFloat(n)) && isFinite(n);
		};

function tabulate(data, columns, loc, percent) {
	var table = d3.select(loc)
    .append('table')
    .attr("class", "table table-striped table-bordered table-hover table-responsive")
	var thead = table.append('thead')
	var	tbody = table.append('tbody');

	// append the header row
	thead.append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
	    .text(function (column) { return column; });

	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(data)
	  .enter()
	  .append('tr');

	// create a cell in each row for each column
	var cells = rows.selectAll('td')
	  .data(function (row) {
	    return columns.map(function (column) {
	      return {column: column, value: row[column]};
	    });
	  })
	  .enter()
	  .append('td')
	    .text(function (d) {
				var datavalue;
				if (percent == "percent") {
					if(d.value <= 5){
						datavalue = formatPercent(parseFloat(d.value))
					}
					else if(isNumeric(d.value)){
						datavalue = formatDecimalComma(d.value)
					}
					else{
						datavalue = d.value
					}}
				if (percent == "nopercent") {
					if(isNumeric(d.value)){
						datavalue = formatDecimalComma(d.value)
					}
					else{
						datavalue = d.value
					}}
			//	console.log(d.value)
				return datavalue;
			});


  return table;
}

	// render the table(s)
	//tabulate(data, ['date', 'close']); // 2 column table

//});
