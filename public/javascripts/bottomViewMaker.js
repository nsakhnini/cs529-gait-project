
import {filterDemo} from "./mainSceneMaker.js";

export function loadPlots() {
    removeAllPlots();

    var margin = {top: 10, right: 30, bottom: 20, left: 60},
    width = document.getElementById("filter-sidebar").getBoundingClientRect().width *0.79;
    
    var yLabels = 'Male Female'.split(' ')

    var yData = [0, 0];
    filterDemo.forEach(element => element.Gender === 0 ? yData[1]++ : yData[0]++);
    let genderDataObject = {};
    yLabels.forEach((key, i) => genderDataObject[key] = yData[i]);
    let genderData = [];
    genderData.push(genderDataObject);

    // Gender plot
    var svg = d3.select("#gender-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", window.innerHeight * 0.2)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top * 3 + ")");

    var max = Math.max(yData[0], yData[1])
    var x = d3.scaleBand()
      .domain(Array.from(Array(max+1).keys()).slice(1, max+1))
      .range([0, width])
      .padding(0);

    var y = d3.scaleBand()
      .domain(Object.keys(genderDataObject))
      .range([window.innerHeight * 0.14, 0])
      .padding(0.2);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll(".genderBars")
    .data(yData)
    .enter()
      .append("rect")
      .attr("class", "genderBars")
      .attr("x", x(0))
      .attr("y",  function (d, i) {
          if(i == 0){
              return y("Male")
          } else if(i == 1){
              return y("Female")
          }
      } )
      .attr("width", function (d) {
          return (x(d));
      })
      .attr("height", y.bandwidth())
      .attr("fill", "#00adb5")

    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top - 5)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Gender")

    svg.selectAll(".text")
        .data(yData)
        .enter()
        .append("text")
        .text(function (d){
            return d;
        })
        .attr("text-anchor", "middle")
        .attr("dy", ".5em")
        .attr("x", function(d, i) {
            return x(d)-18;
        })
        .attr("y", function(d, i) {
            if(i == 0){
                return y("Male")+23
            } else if(i == 1){
                return y("Female")+23
            }
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black");

    // Age plot
    svg = d3.select("#age-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", window.innerHeight * 0.2)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);

    svg.append("g")
      .attr("transform", "translate(0," + window.innerHeight * 0.14 + ")")
      .call(d3.axisBottom(x).tickValues([]))

    var y = d3.scaleLinear()
      .domain([0, 75]) // dataset range for ages 19-67
      .range([window.innerHeight * 0.14, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(3.5));

    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Age); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return (window.innerHeight * 0.14) - y(d.Age); })
        .attr("fill", "#00adb5");

    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Ages");

    width = document.getElementById("two-d-sidebar").getBoundingClientRect().width *0.79;

    // Height plot
    svg = d3.select("#height-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height",window.innerHeight * 0.25)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);

    svg.append("g")
      .attr("transform", "translate(0," + window.innerHeight * 0.175 + ")")
      .call(d3.axisBottom(x).tickValues([])) ;

    var y = d3.scaleLinear()
      .domain([140, 195]) // dataset range for height 154-192
      .range([window.innerHeight * 0.175, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(7));

    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Height*100); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return (window.innerHeight * 0.175) - y(d.Height*100); })
        .attr("fill", "#00adb5");

    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Heights");

    // Weight plot
    svg = d3.select("#weight-plot")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", window.innerHeight * 0.25)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
      .range([0, width])
      .domain(filterDemo.map(function(d, i) { return i+1; }))
      .padding(0.2);

    svg.append("g")
      .attr("transform", "translate(0," + window.innerHeight * 0.175 + ")")
      .call(d3.axisBottom(x).tickValues([]));

    var y = d3.scaleLinear()
      .domain([40, 100]) // dataset range for weight 50-98
      .range([window.innerHeight * 0.175, 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    svg.selectAll("bar")
      .data(filterDemo)
      .enter()
      .append("rect")
        .attr("x", function(d, i) { return x(i+1); })
        .attr("y", function(d) { return y(d.Weight); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return (window.innerHeight * 0.175) - y(d.Weight); })
        .attr("fill", "#00adb5");

    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", margin.top)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px")
      .style("fill", "white")
      .text("Weights");
}

function removeAllPlots(){
    d3.select("#gender-plot").select("svg").remove();
    d3.select("#age-plot").select("svg").remove();
    d3.select("#weight-plot").select("svg").remove();
    d3.select("#height-plot").select("svg").remove();
    d3.select("#gender-plot").html("");
    d3.select("#age-plot").html("");
    d3.select("#weight-plot").html("");
    d3.select("#height-plot").html("");
}
