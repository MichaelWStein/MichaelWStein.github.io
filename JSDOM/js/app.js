// from data.js
var tableData = data;

//selecting the place for the insert
var tbody = d3.select("tbody");


// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var date = d3.select("#datetime").node().value;
  
  // clear the input value
  d3.select("#datetime").node().value = "";
 
  // call the function to create the table 
  createTable(date)

};

// This is for creation of a table with the filtered data.
// The table will be created anytime the 'Filter Table' Data is pressed and data in a valid format is entered for filtration.
// Each pressing of the refresh button of the website will create a complete table (see below).
function createTable(dateT) {

  //First I need to delete all rows except the headrow
  var table = document.getElementById("ufo-table");
  for(var i = table.rows.length - 1; i > 0; i--)
  {
      table.deleteRow(i);
  }

  //Then I need to re-create the table with the filtered data
  tableData.forEach((UFOSight) => {
    //The append below should only happen if the filter categories are fulfilled
    if (UFOSight.datetime == dateT) {
      var row = tbody.append("tr");
      //Looping through each object, creating the table cells and inserting the values into the cells.
      Object.entries(UFOSight).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);  
      });
    }
  });
}

//Looping through the dataset, inserting a row for each Object.
//The complete table will be created anytime the website is refreshed.
tableData.forEach((UFOSight) => {
  var row = tbody.append("tr");
  //Looping through each object, creating the table cells and inserting the values into the cells.
  Object.entries(UFOSight).forEach(([key, value]) => {
    var cell = row.append("td");
    cell.text(value);  
  });
});


// Add event listener for submit button
d3.select("#filter-btn").on("click", handleSubmit);
