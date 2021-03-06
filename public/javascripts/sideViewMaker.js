
import {filterDemo, currentParticipantsData} from "./mainSceneMaker.js";

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 350 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

const participant = {
  id: "2014001",
  speed: "3",
  trial: "1",
  color: "red",
};
const participant2 = {
  id: "2014002",
  speed: "3",
  trial: "1",
  color: "yellow",
};
const selected_participant = [participant, participant2];


const SCALE_FACTOR = 7;
const VELOCITY = 15;

export function loadSideView() {
  removeAllPlots();
  loadPlots();
  loadViews();
}

async function loadPlots() {
  let data = [];
  await d3.csv("./data/markers.csv", function (d) {
    data.push(d);
  });

  // Front Slice View
  var svg_front = d3
      .select("#front-slice")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background-color", "black");

  svg_front
      .append("text")
      .attr("x", width / 2)
      .attr("y", "30")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Front Slice View");

  let group_front = svg_front
      .append("g") // All participants group
      .attr("transform", "translate(100,50)"); //translate(" + margin.left + "," + margin.top + ")");

  // Side Slice View
  let svg_side = d3
      .select("#side-slice")
      .append("svg")
      .attr("width", "97%")
      .attr("height", "100%")
      .style("background-color", "black");

  svg_side
      .append("text")
      .attr("x", width / 2)
      .attr("y", "30")
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Side Slice View");

  let group_side = svg_side
      .append("g")
      .attr("transform", "translate(" + (margin.left + 60) + ",50)");

  let filtered_data;
  selected_participant.forEach((participant) => {
    filtered_data = getFilteredData(data, participant);
    addPoints(group_front, getFrontViewData(filtered_data), participant);
    addPoints(group_side, getSideViewData(filtered_data), participant);
  });
}

function addBodyPartMarkers(svg, data) {
  var first = data[0];
  for (var i = 0; i < first.length; i++) {
    var point = first[i];
    svg
        .append("g")
        .selectAll(point.name)
        .data([point])
        .enter()
        .append("circle")
        .attr("id", function (d) {
          return d.name;
        })
        .attr("cx", function (d) {
          return d.X / SCALE_FACTOR;
        })
        .attr("cy", function (d) {
          return height - d.Y / SCALE_FACTOR;
        })
        .attr("r", 1.5)
        .style("fill", "yellow")
        .attr("transform", "translate(0,20)");

    animate(svg, point.name, data, {id: ""});
  }
}

function getBodyPartTopData(data) {
  return data.map(function (mark) {
    return [
      {name: "L_FCC", X: mark.L_FCC_X, Y: mark.L_FCC_Y},
      {name: "L_FM1", X: mark.L_FM1_X, Y: mark.L_FM1_Y},
      {name: "L_FM2", X: mark.L_FM2_X, Y: mark.L_FM2_Y},
      {name: "L_FM5", X: mark.L_FM5_X, Y: mark.L_FM5_Y},
      {name: "R_FCC", X: mark.R_FCC_X, Y: mark.R_FCC_Y},
      {name: "R_FM1", X: mark.R_FM1_X, Y: mark.R_FM1_Y},
      {name: "R_FM2", X: mark.R_FM2_X, Y: mark.R_FM2_Y},
      {name: "R_FM5", X: mark.R_FM5_X, Y: mark.R_FM5_Y},
    ];
  });
}

function addPoints(group, data, participant) {
  let participantGroup = group.append("g");

  var first = data[0];
  for (var i = 0; i < first.length; i++) {
    var point = first[i];
    participantGroup
        //.append("g")
        .selectAll(point.name)
        .data([point])
        .enter()
        .append("circle")
        .attr("id", function (d) {
          return d.name + participant.id;
        })
        .attr("cx", function (d) {
          return d.X / SCALE_FACTOR;
        })
        .attr("cy", function (d) {
          return height - d.Y / SCALE_FACTOR;
        })
        .attr("r", 1.5)
        .style("fill", participant.color); //"#00ff48"

    animate(participantGroup, point.name, data, participant);
  }
}

function animate(svg, body_label, data, participant) {
  let time = 1;
  let body_markers = data[time];
  let marker = body_markers.find(({name}) => name === body_label);
  svg
      .selectAll("#" + body_label + participant.id)
      .transition()
      //.delay(function(d,i){return(i*3)})
      .duration(VELOCITY)
      .attr("cx", function (d) {
        return marker.X / SCALE_FACTOR;
      })
      .attr("cy", function (d) {
        return height - marker.Y / SCALE_FACTOR;
      })
      .on("start", function repeat() {
        if (++time >= data.length) time = 0;
        //return

        body_markers = data[time];
        marker = body_markers.find(({name}) => name === body_label);
        d3.active(this)
            .transition()
            .attr("cx", marker.X / SCALE_FACTOR)
            .attr("cy", height - marker.Y / SCALE_FACTOR)
            .on("start", repeat);
      });
}

function getFilteredData(data, participant) {
  return data.filter(function (mark) {
    return (
        mark.Participant === participant.id &&
        mark.Speed === participant.speed &&
        mark.Trial === participant.trial
    );
  });
}

function getSideViewData(data) {
  return data.map(function (mark) {
    return [
      {name: "L_IAS", X: mark.L_IAS_X, Y: mark.L_IAS_Z},
      {name: "L_IPS", X: mark.L_IPS_X, Y: mark.L_IPS_Z},
      {name: "R_IPS", X: mark.R_IPS_X, Y: mark.R_IPS_Z},
      {name: "R_IAS", X: mark.R_IAS_X, Y: mark.R_IAS_Z},
      {name: "L_FTC", X: mark.L_FTC_X, Y: mark.L_FTC_Z},
      {name: "L_FLE", X: mark.L_FLE_X, Y: mark.L_FLE_Z},
      {name: "L_FME", X: mark.L_FME_X, Y: mark.L_FME_Z},
      {name: "L_FAX", X: mark.L_FAX_X, Y: mark.L_FAX_Z},
      {name: "L_TTC", X: mark.L_TTC_X, Y: mark.L_TTC_Z},
      {name: "L_FAL", X: mark.L_FAL_X, Y: mark.L_FAL_Z},
      {name: "L_TAM", X: mark.L_TAM_X, Y: mark.L_TAM_Z},
      {name: "L_FCC", X: mark.L_FCC_X, Y: mark.L_FCC_Z},
      {name: "L_FM1", X: mark.L_FM1_X, Y: mark.L_FM1_Z},
      {name: "L_FM2", X: mark.L_FM2_X, Y: mark.L_FM2_Z},
      {name: "L_FM5", X: mark.L_FM5_X, Y: mark.L_FM5_Z},
      {name: "R_FTC", X: mark.R_FTC_X, Y: mark.R_FTC_Z},
      {name: "R_FLE", X: mark.R_FLE_X, Y: mark.R_FLE_Z},
      {name: "R_FME", X: mark.R_FME_X, Y: mark.R_FME_Z},
      {name: "R_FAX", X: mark.R_FAX_X, Y: mark.R_FAX_Z},
      {name: "R_TTC", X: mark.R_TTC_X, Y: mark.R_TTC_Z},
      {name: "R_FAL", X: mark.R_FAL_X, Y: mark.R_FAL_Z},
      {name: "R_TAM", X: mark.R_TAM_X, Y: mark.R_TAM_Z},
      {name: "R_FCC", X: mark.R_FCC_X, Y: mark.R_FCC_Z},
      {name: "R_FM1", X: mark.R_FM1_X, Y: mark.R_FM1_Z},
      {name: "R_FM2", X: mark.R_FM2_X, Y: mark.R_FM2_Z},
      {name: "R_FM5", X: mark.R_FM5_X, Y: mark.R_FM5_Z},
      {name: "CV7", X: mark.CV7_X, Y: mark.CV7_Z},
      {name: "TV10", X: mark.TV10_X, Y: mark.TV10_Z},
      {name: "SXS", X: mark.SXS_X, Y: mark.SXS_Z},
      {name: "SJN", X: mark.SJN_X, Y: mark.SJN_Z},
      {name: "L_SIA", X: mark.L_SIA_X, Y: mark.L_SIA_Z},
      {name: "L_SRS", X: mark.L_SRS_X, Y: mark.L_SRS_Z},
      {name: "L_SAA", X: mark.L_SAA_X, Y: mark.L_SAA_Z},
      {name: "L_SAE", X: mark.L_SAE_X, Y: mark.L_SAE_Z},
      {name: "L_HLE", X: mark.L_HLE_X, Y: mark.L_HLE_Z},
      {name: "L_HME", X: mark.L_HME_X, Y: mark.L_HME_Z},
      {name: "L_UOA", X: mark.L_UOA_X, Y: mark.L_UOA_Z},
      {name: "L_RSP", X: mark.L_RSP_X, Y: mark.L_RSP_Z},
      {name: "L_UHE", X: mark.L_UHE_X, Y: mark.L_UHE_Z},
      {name: "L_HM2", X: mark.L_HM2_X, Y: mark.L_HM2_Z},
      {name: "L_HM5", X: mark.L_HM5_X, Y: mark.L_HM5_Z},
      {name: "R_SIA", X: mark.R_SIA_X, Y: mark.R_SIA_Z},
      {name: "R_SRS", X: mark.R_SRS_X, Y: mark.R_SRS_Z},
      {name: "R_SAA", X: mark.R_SAA_X, Y: mark.R_SAA_Z},
      {name: "R_SAE", X: mark.R_SAE_X, Y: mark.R_SAE_Z},
      {name: "R_HLE", X: mark.R_HLE_X, Y: mark.R_HLE_Z},
      {name: "R_HME", X: mark.R_HME_X, Y: mark.R_HME_Z},
      {name: "R_UOA", X: mark.R_UOA_X, Y: mark.R_UOA_Z},
      {name: "R_RSP", X: mark.R_RSP_X, Y: mark.R_RSP_Z},
      {name: "R_UHE", X: mark.R_UHE_X, Y: mark.R_UHE_Z},
      {name: "R_HM2", X: mark.R_HM2_X, Y: mark.R_HM2_Z},
      {name: "R_HM5", X: mark.R_HM5_X, Y: mark.R_HM5_Z},
    ];
  });
}

function getFrontViewData(data) {
  return data.map(function (mark) {
    return [
      {name: "L_IAS", X: mark.L_IAS_Y, Y: mark.L_IAS_Z},
      {name: "L_IPS", X: mark.L_IPS_Y, Y: mark.L_IPS_Z},
      {name: "R_IPS", X: mark.R_IPS_Y, Y: mark.R_IPS_Z},
      {name: "R_IAS", X: mark.R_IAS_Y, Y: mark.R_IAS_Z},
      {name: "L_FTC", X: mark.L_FTC_Y, Y: mark.L_FTC_Z},
      {name: "L_FLE", X: mark.L_FLE_Y, Y: mark.L_FLE_Z},
      {name: "L_FME", X: mark.L_FME_Y, Y: mark.L_FME_Z},
      {name: "L_FAX", X: mark.L_FAX_Y, Y: mark.L_FAX_Z},
      {name: "L_TTC", X: mark.L_TTC_Y, Y: mark.L_TTC_Z},
      {name: "L_FAL", X: mark.L_FAL_Y, Y: mark.L_FAL_Z},
      {name: "L_TAM", X: mark.L_TAM_Y, Y: mark.L_TAM_Z},
      {name: "L_FCC", X: mark.L_FCC_Y, Y: mark.L_FCC_Z},
      {name: "L_FM1", X: mark.L_FM1_Y, Y: mark.L_FM1_Z},
      {name: "L_FM2", X: mark.L_FM2_Y, Y: mark.L_FM2_Z},
      {name: "L_FM5", X: mark.L_FM5_Y, Y: mark.L_FM5_Z},
      {name: "R_FTC", X: mark.R_FTC_Y, Y: mark.R_FTC_Z},
      {name: "R_FLE", X: mark.R_FLE_Y, Y: mark.R_FLE_Z},
      {name: "R_FME", X: mark.R_FME_Y, Y: mark.R_FME_Z},
      {name: "R_FAX", X: mark.R_FAX_Y, Y: mark.R_FAX_Z},
      {name: "R_TTC", X: mark.R_TTC_Y, Y: mark.R_TTC_Z},
      {name: "R_FAL", X: mark.R_FAL_Y, Y: mark.R_FAL_Z},
      {name: "R_TAM", X: mark.R_TAM_Y, Y: mark.R_TAM_Z},
      {name: "R_FCC", X: mark.R_FCC_Y, Y: mark.R_FCC_Z},
      {name: "R_FM1", X: mark.R_FM1_Y, Y: mark.R_FM1_Z},
      {name: "R_FM2", X: mark.R_FM2_Y, Y: mark.R_FM2_Z},
      {name: "R_FM5", X: mark.R_FM5_Y, Y: mark.R_FM5_Z},
      {name: "CV7", X: mark.CV7_Y, Y: mark.CV7_Z},
      {name: "TV10", X: mark.TV10_Y, Y: mark.TV10_Z},
      {name: "SXS", X: mark.SXS_Y, Y: mark.SXS_Z},
      {name: "SJN", X: mark.SJN_Y, Y: mark.SJN_Z},
      {name: "L_SIA", X: mark.L_SIA_Y, Y: mark.L_SIA_Z},
      {name: "L_SRS", X: mark.L_SRS_Y, Y: mark.L_SRS_Z},
      {name: "L_SAA", X: mark.L_SAA_Y, Y: mark.L_SAA_Z},
      {name: "L_SAE", X: mark.L_SAE_Y, Y: mark.L_SAE_Z},
      {name: "L_HLE", X: mark.L_HLE_Y, Y: mark.L_HLE_Z},
      {name: "L_HME", X: mark.L_HME_Y, Y: mark.L_HME_Z},
      {name: "L_UOA", X: mark.L_UOA_Y, Y: mark.L_UOA_Z},
      {name: "L_RSP", X: mark.L_RSP_Y, Y: mark.L_RSP_Z},
      {name: "L_UHE", X: mark.L_UHE_Y, Y: mark.L_UHE_Z},
      {name: "L_HM2", X: mark.L_HM2_Y, Y: mark.L_HM2_Z},
      {name: "L_HM5", X: mark.L_HM5_Y, Y: mark.L_HM5_Z},
      {name: "R_SIA", X: mark.R_SIA_Y, Y: mark.R_SIA_Z},
      {name: "R_SRS", X: mark.R_SRS_Y, Y: mark.R_SRS_Z},
      {name: "R_SAA", X: mark.R_SAA_Y, Y: mark.R_SAA_Z},
      {name: "R_SAE", X: mark.R_SAE_Y, Y: mark.R_SAE_Z},
      {name: "R_HLE", X: mark.R_HLE_Y, Y: mark.R_HLE_Z},
      {name: "R_HME", X: mark.R_HME_Y, Y: mark.R_HME_Z},
      {name: "R_UOA", X: mark.R_UOA_Y, Y: mark.R_UOA_Z},
      {name: "R_RSP", X: mark.R_RSP_Y, Y: mark.R_RSP_Z},
      {name: "R_UHE", X: mark.R_UHE_Y, Y: mark.R_UHE_Z},
      {name: "R_HM2", X: mark.R_HM2_Y, Y: mark.R_HM2_Z},
      {name: "R_HM5", X: mark.R_HM5_Y, Y: mark.R_HM5_Z},
    ];
  });
}

async function loadViews() {
  let data = [];
  await d3.csv("./data/markers.csv", function (d) {
    data.push(d);
  });

  let filtered_data1 = getFilteredData(data, participant);
  let filtered_data2 = getFilteredData(data, participant2);

  width = document.getElementById("two-d-sidebar").getBoundingClientRect().width *0.65;
  height = document.getElementById("two-d-sidebar").getBoundingClientRect().height *0.28;

  var svg = d3
      .select("#view-top")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
          "transform",
          "translate(" + (margin.left + 80) + "," + margin.top + ")"
      );

  svg
      .append("rect")
      .attr("x", -100)
      .attr("y", 15)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("fill", "black");

  svg
      .append("text")
      .attr("x", width / 2 - 80)
      .attr("y", margin.top - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "white")
      .text("Footsteps Top View");

  addBodyPartMarkers(svg, getBodyPartTopData(filtered_data1));
  addBodyPartMarkers(svg, getBodyPartTopData(filtered_data2));
  // await loadSideView();
}

function removeAllPlots(){
  d3.select("#front-slice").select("svg").remove();
  d3.select("#side-slice").select("svg").remove();
  d3.select("#view-top").select("svg").remove();
  d3.select("#front-slice").html("");
  d3.select("#side-slice").html("");
  d3.select("#view-top").html("");
}
