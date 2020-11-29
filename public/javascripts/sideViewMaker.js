
async function loadPlots() {
    let data = [];
    await d3.csv("./data/markers.csv", function(d) {
        data.push(d);
    });
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 350 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    // Front Slice View
    var svg = d3.select("#front-slice")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("transform",
            "translate(" + (width - margin.right) + " ," +
            (height + margin.top + 20) + ")")
        .attr("dx", "2em")
        .style("fill", "white")
        .text("X");
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - margin.top)
        .attr("dy", "2em")
        .style("fill", "white")
        .text("Y");
    svg.append('g')
        .selectAll("dot")
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Front Slice View")

    // Side Slice View
    svg = d3.select("#side-slice")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("transform",
            "translate(" + (width - margin.right) + " ," +
            (height + margin.top + 20) + ")")
        .attr("dx", "2em")
        .style("fill", "white")
        .text("Z");
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - margin.top)
        .attr("dy", "2em")
        .style("fill", "white")
        .text("Y");
    svg.append('g')
        .selectAll("dot")
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Side Slice View")
}

loadPlots();
