// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    //Parse Data/Cast as numbers
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    //Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "teal")
    .attr("opacity", ".5");


    var abbrGroup = chartGroup.selectAll("text.abbr")
    .data(healthData)
    .enter()
    .append("text")
    .attr("class","abbr")
    .text(d=>d.abbr)
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare))
    .style("text-anchor","middle")
    .style("font-size","10px");


    //Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`Poverty: ${d.poverty}<br>Healthcare:${d.healthcare}`);
      });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    
