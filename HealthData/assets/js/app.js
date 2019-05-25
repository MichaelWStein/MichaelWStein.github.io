//Declaring variables

var state = [];
var stateAbr = [];
var poverty = [];
var noHealthC = [];
var chartHealthAr = [];

// Importing the dataset
  
d3.csv("assets/Data/data.csv").then(function(returns) {
  var healthData = Object.entries(returns); 
  console.log("Data =", healthData);

  healthData.forEach(function assign(dataElement) {
    state.push(dataElement[1].state);
    stateAbr.push(dataElement[1].abbr);
    poverty.push(dataElement[1].poverty);
    noHealthC.push(dataElement[1].healthcare);
  });

  // Last Element contains the column names, needs to be romoved
  state.pop();
  stateAbr.pop();
  poverty.pop();
  noHealthC.pop();
  console.log("State =", stateAbr)

  //Transform arrays from string into numeric if required
  poverty = poverty.map(Number);
  noHealthC = noHealthC.map(Number);

  //Re-create Array of objects for creating the scatterplot
  var i;
  for (i = 0; i < state.length; i++){
      var helpObj = {"state": state[i], "stateAbr": stateAbr[i], "poverty": poverty[i], "noHealthC": noHealthC[i]};
      chartHealthAr.push(helpObj);
    };
  
  // Setting the dimensions for the SVG container
  var svgHeight = 600;
  var svgWidth = 960;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  //Basic information for chart

  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(chartHealthAr, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(chartHealthAr, d => d.noHealthC)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  //Creating the chart

  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  chartGroup.append("g")
      .call(leftAxis);

  //Create the circles for the scatter plot

  var circlesGroup = chartGroup.selectAll("circle")
    .data(chartHealthAr)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.noHealthC))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");   
  
  //Creating the text for each block

  chartGroup.append("g")
    .selectAll("text") 
    .data(chartHealthAr)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.noHealthC))
    .attr("dx", "-10") 
    .attr("dy", "5")
    .text(function(d){return d.stateAbr})
    .attr("font-size", "15px")
    .attr("fill", "black");
  
  // Create the tooltip
    
  var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>No Health Care: ${d.noHealthC}`);
      });

    chartGroup.call(toolTip);

    // Event listener to show the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("No Health Care in %");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty Rate in %");
});
