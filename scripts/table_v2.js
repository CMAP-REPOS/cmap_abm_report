// Time to make the tables
function tabulate_v2(data, columns, loc) {
  var table = d3.select("body").append("table").attr("class","table table-striped table-bordered table-hover table-responsive"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  thead.selectAll("tr")
      .data(columns)
      .enter()
      .append("tr")
      .selectAll("th")
          .data(function(d) {return d;})
          .enter()
          .append("th")
          .attr("colspan", function(d) {return d.span;})
          .text(function(d) {return d.name;});

  // Create a row for each object in the data
  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");
console.log(data)
  // Create a cell in each row for each column
  var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
            console.log(column);
              return {
                  column: column,
                  value: row[column]
              };
          });
      })
      .enter()
      .append("td")
      .html(function(d) {
          return d.value;
      });
  return table;
}
