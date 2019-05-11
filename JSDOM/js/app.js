// from data.js
var tableData = data;

//selecting the place for the insert
var tbody = d3.select("tbody");

// The array with the data used to build the filter
var filter = [];


// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();
  
  //Need to empty the filter array
  filter.length = 0;

  // Select the input value from the form
  var date = d3.select("#datetime").node().value;
  if (date != ""){
      filter.push({datetime: date});
  }

  var city = d3.select("#citytype").node().value;
  if (city != ""){
      filter.push({city: city});
  }

  var state = d3.select("#statetype").node().value;
  if (state != ""){
      filter.push({state: state});
  }

  var country = d3.select("#countrytype").node().value;
  if (country != ""){
      filter.push({country: country});
  }

  var shape = d3.select("#shapetype").node().value;
  if (shape != ""){
      filter.push({shape: shape});
  }
  console.log(filter);
  
  // call the function to create the table, submitting the data for the filter 
  createTable(filter)

};


// This is for creation of a table with the filtered data.
// The table will be created anytime the 'Filter Table' Data is pressed and data in a valid format is entered for filtration.
// Each pressing of the refresh button of the website will create a complete table (see below).
function createTable(filter) {
  //First I need to delete all rows except the headrow
  var table = document.getElementById("ufo-table");
  for(var i = table.rows.length - 1; i > 0; i--)
  {
      table.deleteRow(i);
  }

  //Then I need to re-create the table with the filtered data. If no data meets the filter requirement, the table will be empty.
  tableData.forEach((UFOSight) => {
    if (filterCheck(UFOSight) == true) {
      var row = tbody.append("tr");
    //Looping through each object, creating the table cells and inserting the values into the cells, but just for the selected date
      Object.entries(UFOSight).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);  
      });
    };
  });
}

function filterCheck(UFOSight) {
  var check = true
  for (var i = 0; i < filter.length; i++) {
    var keysf = Object.keys(filter[i]);
    if(UFOSight[keysf] == filter[i][keysf]) {
      var checkb = true;
    }
    else {var checkb = false;}
    check = check && checkb;
  }
  return check;
}

//Looping through the dataset, inserting a row for each Object.
//The complete table will be created anytime the website is refreshed.
function createComplTable() {
    tableData.forEach((UFOSight) => {
      var row = tbody.append("tr");
        //Looping through each object, creating the table cells and inserting the values into the cells.
        Object.entries(UFOSight).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);  
        });
      });
}

//Creating the complete Table on Refresh 
createComplTable();

// Add event listener for submit button
d3.select("#filter-btn").on("click", handleSubmit);
