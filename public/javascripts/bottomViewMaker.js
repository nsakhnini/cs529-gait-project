
async function loadPlots() {
    let data = [];
    await d3.csv("./data/demographics.csv", function(d) {
        data.push(d);
    });
    //console.log(data[0].ID, data[0].Gender);
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
    var x = d3.scaleLinear()
    .domain([-1, 51])
    .range([0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    var y = d3.scaleLinear()
    .domain([-1, 2])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return (width / 50 * (i+1)); } )
    .attr("cy", function (d) { return y(d.Gender); } )
    .attr("r", 1.5)
    .style("fill", "green")
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
    var x = d3.scaleLinear()
    .domain([-1, 51])
    .range([0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    var y = d3.scaleLinear()
    .domain([10, 75])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return (width / 50 * (i+1)); } )
    .attr("cy", function (d) { return y(d.Age); } )
    .attr("r", 1.5)
    .style("fill", "green")
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
    var x = d3.scaleLinear()
    .domain([-1, 51])
    .range([0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    var y = d3.scaleLinear()
    .domain([150, 195])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return (width / 50 * (i+1)); } )
    .attr("cy", function (d) { return y(d.Height * 100); } )
    .attr("r", 1.5)
    .style("fill", "green")
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
    var x = d3.scaleLinear()
    .domain([-1, 51])
    .range([0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    var y = d3.scaleLinear()
    .domain([45, 105])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return (width / 50 * (i+1)); } )
    .attr("cy", function (d) { return y(d.Weight); } )
    .attr("r", 1.5)
    .style("fill", "green")
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", margin.top)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("fill", "white") 
    .style("text-decoration", "underline")  
    .text("Weight distribution")
}

loadPlots();
