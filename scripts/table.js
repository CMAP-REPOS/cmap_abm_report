//d3.json('data/data.json', function (error,data) {

function tabulate(data, columns, loc) {
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
	    .text(function (d) { return d.value; });

  return table;
}

	// render the table(s)
	//tabulate(data, ['date', 'close']); // 2 column table

//});
