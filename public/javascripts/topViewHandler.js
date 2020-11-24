import * as sceneMaker from './mainSceneMaker.js';

export function createTopView(selectedParticipantFootsteps, selectedParticipant) {
    let topViewSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.getElementById("top-view").appendChild(topViewSVG);
    topViewSVG.style.width = topViewSVG.parentElement.getBoundingClientRect().width + "px";
    topViewSVG.style.height = topViewSVG.parentElement.getBoundingClientRect().width / 3 + "px";
    topViewSVG.setAttribute("id", "top-view-svg");

    const svgSelection = d3.select(topViewSVG);

    svgSelection
        .selectAll('circle')
        .data(selectedParticipant)
        .enter()
        .append("circle")
        .attr('id', function (d, i) {
            return selectedParticipantFootsteps.participantID + "_L_" + i;
        })
        .attr('cx', function (d, i) {
            return  parseFloat(d.L_FCC_X)/2;
        })
        .attr('cy', function (d ,i) {
            return parseFloat(d.L_FCC_Y)/5 ;
        })
        .attr('fill', function (d) {
            return "#0000ff";
        }).attr('r', 2)
        .attr("stroke","red")
        .attr('stroke-width',2)
        .attr("stroke-opacity", 0)
        .attr("transform", function (d) {
        })
        .on("mouseover", function (d){

        })
        .on("mouseout", function (d){
        })
        .on("click", function (d,i) {

        });

    //Right foot circles
    svgSelection
        .selectAll('circle')
        .data(selectedParticipant)
        .enter()
        .append("circle")
        .attr('id', function (d, i) {
            return selectedParticipantFootsteps.participantID + "_R_" + i;
        })
        .attr('cx', function (d, i) {
            return  parseFloat(d.R_FCC_X)/5;
        })
        .attr('cy', function (d ,i) {
            return parseFloat(d.R_FCC_Y)/5 ;
        })
        .attr('fill', function (d) {
            return "#ff00ff";
        }).attr('r', 2)
        .attr("stroke","red")
        .attr('stroke-width',2)
        .attr("stroke-opacity", 0)
        .attr("transform", function (d) {
        })
        .on("mouseover", function (d){

        })
        .on("mouseout", function (d){
        })
        .on("click", function (d,i) {

        });

}