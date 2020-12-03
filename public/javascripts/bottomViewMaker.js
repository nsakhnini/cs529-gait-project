
import {filterDemo} from "./mainSceneMaker.js";

export async function loadPlots() {
    removeAllPlots();
    let data = [];
    await d3.csv("./data/demographics.csv", function(d) {
        data.push(d);
    });

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 350 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // Gender plot
    var svg = d3.select("#gender-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    var yLabels = 'Male Female'.split(' ')
    var y = d3.scaleBand()
      .domain(yLabels)
      .range([height, 0])
      .padding(1);
    svg.append("g")
      .call(d3.axisLeft(y));

    var yData = [0, 0];
    filterDemo.forEach(element => element.Gender === 0 ? yData[0]++ : yData[1]++);
    var genderData = {};
    yLabels.forEach((key, i) => genderData[key] = yData[i]);
    
    svg.selectAll()
      .data(genderData)
      .enter()
      .append("rect")
      .attr("x", 0) // x(0) )
      .attr("y", 50) // (d) => y(d.key) )
      .attr("width", 300) // (d) => width - x(d.value) )
      .attr("height", 100) // y.bandwidth() )
      .attr("fill", "#00adb5")
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("fill", "white") 
      .style("text-decoration", "underline")  
      .text("Gender distribution")

    // Age plot
    svg = d3.select("#age-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)) 
    var y = d3.scaleLinear()
      .domain([0, 70]) // dataset range for ages 19-67
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Age); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Age); })
        .attr("fill", "#00adb5")
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("fill", "white") 
      .style("text-decoration", "underline")  
      .text("Age distribution")

    // Height plot
    svg = d3.select("#height-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)) 
    var y = d3.scaleLinear()
      .domain([100, 195]) // dataset range for height 154-192
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Height*100); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Height*100); })
        .attr("fill", "#00adb5")
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("fill", "white") 
      .style("text-decoration", "underline")  
      .text("Height distribution")

    // Weight plot
    svg = d3.select("#weight-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)) 
    var y = d3.scaleLinear()
      .domain([0, 100]) // dataset range for weight 50-98
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Weight); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Weight); })
        .attr("fill", "#00adb5")
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("fill", "white") 
      .style("text-decoration", "underline")
      .text("Weight distribution")
}

function removeAllPlots(){
    d3.select("#gender-plot").html("");
    d3.select("#age-plot").html("");
    d3.select("#weight-plot").html("");
    d3.select("#height-plot").html("");
}
