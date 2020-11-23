// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import * as humanoidMaker from './humanoidMaker.js';

let markers_data = [];
let demo_data = []; //0 = woman  1 = man
let participants = [];
let participantsData = [];
let markerByParticipant, timestamp = [];
let trial = "1", speed = "1", offsetY = 0;
let filterDemo, filterMarkers;

var leftAge, rightAge, minAge, maxAge;
var leftHeight, rightHeight, minH, maxH;
var leftWeight, rightWeight, minW, maxW;

let midPoint;
let quaternion = new THREE.Quaternion();
let fromVector, toVector, fromP1, fromP2, toP1, toP2;

let isParticipantSelected = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x010101 );

export const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2)/ (window.innerHeight*0.5) , 0.1, 10000 );
camera.up.set(0, 0, 1);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize( (window.innerWidth/2),window.innerHeight *0.5);

//Adding orbit controls to rotate , zoom and pan
scene.controls = new OrbitControls(camera, renderer.domElement);
scene.controls.mouseButtons = {
     MIDDLE: THREE.MOUSE.DOLLY,
     RIGHT: THREE.MOUSE.ROTATE
}
scene.controls.keys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
}
document.getElementById("main-scene").appendChild( renderer.domElement );
drawGrid();

//Adding Custom Axes Helper
let axesHelperRenderer = new THREE.WebGLRenderer({alpha: true});
axesHelperRenderer.setSize( window.innerHeight *0.1, window.innerHeight *0.1 );
document.getElementById('axes-helper').appendChild( axesHelperRenderer.domElement );

let axesHelperScene = new THREE.Scene();
axesHelperScene.background = null;

let axesHelperCamera = new THREE.PerspectiveCamera( 50,  (window.innerHeight *0.1) /  (window.innerHeight *0.1), 1, 1000 );
axesHelperCamera.up = camera.up;
axesHelperScene.add( axesHelperCamera );

const axesHelper = new THREE.AxesHelper(50);
axesHelperScene.add(axesHelper);

function onWindowResize() {
    camera.aspect = (window.innerWidth/2) /(window.innerHeight*0.5);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth/2),window.innerHeight*0.5);
}

window.addEventListener('resize', onWindowResize)

const animate = function () {
    requestAnimationFrame( animate );

    if (timestamp.length == 0){
        for (var i = 0; i<scene.children.length; i++){
            timestamp.push(0);
        }
    }
    else{
        //disregard other children (Grid,etc) from the scene
        const groupChildren = scene.children.filter(child => child.type === "Group").filter(child => typeof child.userData.part === 'undefined')
        groupChildren.forEach(function (d,i) {
            if (i < participantsData.length) {
                if (timestamp[i] >= participantsData[i].length) {
                    timestamp[i] = 0;
                } else {
                    timestamp[i] += 1;
                }
                //Hardcoded need to be fixed
                if (i == 0)
                    move(participantsData[i][timestamp[i]], d);
                else {
                    move(participantsData[i][timestamp[i]], d);
                    d.rotation.z = -Math.PI;
                    d.position.x = 800;
                }
            }
        });
    }

    //Update Axes Helper
    axesHelperCamera.position.sub(camera.position, scene.controls.target);
    axesHelperCamera.position.setLength(100);
    axesHelperCamera.lookAt(axesHelperScene.position);

    renderer.render( scene, camera );
    axesHelperRenderer.render(axesHelperScene, axesHelperCamera);
};

function filterData() {
    var isFemaleChk = document.getElementById("female-check").checked;
    var isMaleChk = document.getElementById("male-check").checked;

    //Needs to be removed or better way to hide
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (d.userData.gender == "0.0") {
            if(isFemaleChk)
                d.visible = true;
            else
                d.visible = false;

        } else {
            if(isMaleChk)
                d.visible = true;
            else
                d.visible = false;
        }
    });
}

function ageSlider() {
    leftAge = document.getElementsByClassName("age-slider-input")[0];
    rightAge = document.getElementsByClassName("age-slider-input")[1];
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (Math.floor(d.userData.age) >= parseInt(leftAge.value) && Math.floor(d.userData.age) <= parseInt(rightAge.value))
            d.visible = true;
        else {
            d.visible = false;
        }
    });
}

function heightSlider() {
    leftHeight = document.getElementsByClassName("height-slider-input")[0];
    rightHeight = document.getElementsByClassName("height-slider-input")[1];
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (Math.floor(d.userData.height * 100) >= parseInt(leftHeight.value) && Math.floor(d.userData.height * 100) <= parseInt(rightHeight.value))
            d.visible = true;
        else {
            d.visible = false;
        }
    });
}

function weightSlider() {
    leftWeight = document.getElementsByClassName("weight-slider-input")[0];
    rightWeight = document.getElementsByClassName("weight-slider-input")[1];
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (Math.floor(d.userData.weight) >= parseInt(leftWeight.value) && Math.floor(d.userData.weight) <= parseInt(rightWeight.value))
            d.visible = true;
        else {
            d.visible = false;
        }
    });
}

async function loadData(){
    var markers_file = "./data/markers.csv";
    var demo_file = "./data/demographics.csv";

    await  d3.csv(markers_file, function(d) {
        markers_data.push(d);
    });
    await  d3.csv(demo_file, function(d) {
        demo_data.push(d);
    });
    markerByParticipant = d3.group(markers_data, d => d.Participant, d=>d.Speed, d=>d.Trial);
    //First participant only
    var iterator = markerByParticipant.keys();
    var pID = iterator.next().value;

    while (typeof pID !==  "undefined"){
        participants.push(pID);
        participantsData.push(
            markerByParticipant.get(pID).get(speed).get(trial)
        );
        pID = iterator.next().value;
    }


    for (let i = 0; i<participants.length; i++){
        //Change offset at X for rows (in front of each other)
        drawHumanDots(participantsData[i][0], offsetY);
        offsetY = offsetY + 1000;
    }

    loadParticipantsDataToFilter(participants);

    camera.position.x =-3238;
    camera.position.y = 107.15;
    camera.position.z =231.33;

    camera.rotation.x = -1.72353
    camera.rotation.y = -1.3973
    camera.rotation.z = 2.99

    handleMainViewText(20,50,1.4,1.9,45,200);
    animate();
}

function drawGrid(){
    let size = 5000;
    let division = 20;
    const gridHelper = new THREE.GridHelper( size, division );
    gridHelper.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI / 180 ) )
    scene.add( gridHelper );
}

function drawHumanDots(humanData, offset){
    humanoidMaker.createHumanoid(humanData, offset, demo_data, scene);
}

function move(data, person){
    if (typeof data !== 'undefined'){
        let offset = parseInt(person.userData.offset);
        person.children.forEach(function (d) {
            let joint = d.userData.joint;
            if (typeof joint === 'undefined'){
                d.children.forEach(function (v, index, array) {
                    if (v.userData.part === "back"){
                        midPoint = [(parseFloat(data[v.userData.point2[0]]) + parseFloat(data[v.userData.point2[3]])) / 2 ,
                            ((parseFloat(data[v.userData.point2[1]]) + parseFloat(data[v.userData.point2[4]])) / 2) ,
                                    (parseFloat(data[v.userData.point2[2]]) + parseFloat(data[v.userData.point2[5]])) / 2]    ;
                        v.position.x = (parseFloat(data[v.userData.point1[0]]) + midPoint[0]) / 2;
                        v.position.y = ((parseFloat(data[v.userData.point1[1]]) + midPoint[1]) / 2) + offset;
                        v.position.z = (parseFloat(data[v.userData.point1[2]]) + midPoint[2]) / 2;

                        fromP1 = new THREE.Vector3(parseFloat(v.userData.p1data[0]), parseFloat(v.userData.p1data[1]), parseFloat(v.userData.p1data[2]));
                        fromP2 = new THREE.Vector3((parseFloat(v.userData.mid1data[0]) + parseFloat(v.userData.mid2data[0]))/2,
                                                   (parseFloat(v.userData.mid1data[1]) + parseFloat(v.userData.mid2data[1]))/2,
                                                   (parseFloat(v.userData.mid1data[2]) + parseFloat(v.userData.mid2data[2]))/2);

                        fromVector = new THREE.Vector3().subVectors(fromP2, fromP1);

                        toP1 = new THREE.Vector3(parseFloat(data[v.userData.point1[0]]),parseFloat(data[v.userData.point1[1]]),parseFloat(data[v.userData.point1[2]]));
                        toP2 = new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]);

                        v.userData.p1data = [toP1.x, toP1.y, toP1.z];
                        v.userData.mid1data = [parseFloat(data[v.userData.point2[0]]), parseFloat(data[v.userData.point2[1]]), parseFloat(data[v.userData.point2[2]])];
                        v.userData.mid2data = [parseFloat(data[v.userData.point2[3]]), parseFloat(data[v.userData.point2[4]]), parseFloat(data[v.userData.point2[5]])];

                        toVector = new THREE.Vector3().subVectors(toP2, toP1);

                        quaternion.setFromUnitVectors(fromVector.normalize(), toVector.normalize());//To normalize vector to unit vector .normalize()

                        v.applyQuaternion(quaternion);
                    }
                    else{
                        v.position.x = (parseFloat(data[v.userData.point1[0]]) + parseFloat(data[v.userData.point2[0]])) / 2;
                        v.position.y = ((parseFloat(data[v.userData.point1[1]]) + parseFloat(data[v.userData.point2[1]])) / 2) + offset;
                        v.position.z = (parseFloat(data[v.userData.point1[2]]) + parseFloat(data[v.userData.point2[2]])) / 2;

                        fromP1 = new THREE.Vector3(parseFloat(v.userData.p1data[0]), parseFloat(v.userData.p1data[1]), parseFloat(v.userData.p1data[2]));
                        fromP2 = new THREE.Vector3(parseFloat(v.userData.p2data[0]), parseFloat(v.userData.p2data[1]), parseFloat(v.userData.p2data[2]));

                        fromVector = new THREE.Vector3().subVectors(fromP2, fromP1);

                        toP1 = new THREE.Vector3(parseFloat(data[v.userData.point1[0]]),parseFloat(data[v.userData.point1[1]]),parseFloat(data[v.userData.point1[2]]));
                        toP2 = new THREE.Vector3(parseFloat(data[v.userData.point2[0]]),parseFloat(data[v.userData.point2[1]]),parseFloat(data[v.userData.point2[2]]));

                        v.userData.p1data = [toP1.x, toP1.y, toP1.z];
                        v.userData.p2data = [toP2.x, toP2.y, toP2.z];

                        toVector = new THREE.Vector3().subVectors(toP2, toP1);

                        quaternion.setFromUnitVectors(fromVector.normalize(), toVector.normalize());//To normalize vector to unit vector .normalize()

                        v.applyQuaternion(quaternion);
                    }
                })
            }
            switch (joint) {
                case "CV7":
                    d.position.set(data.CV7_X, parseInt(data.CV7_Y) + offset, data.CV7_Z);
                    break;
                case "L_FAL":
                    d.position.set(data.L_FAL_X, parseInt(data.L_FAL_Y) + offset, data.L_FAL_Z);
                    break;
                case "L_FAX":
                    d.position.set(data.L_FAX_X, parseInt(data.L_FAX_Y) + offset, data.L_FAX_Z);
                    break;
                case "L_FCC":
                    d.position.set(data.L_FCC_X, parseInt(data.L_FCC_Y) + offset, data.L_FCC_Z);
                    break;
                case "L_FLE":
                    d.position.set(data.L_FLE_X, parseInt(data.L_FLE_Y) + offset, data.L_FLE_Z);
                    break;
                case "L_FM1":
                    d.position.set(data.L_FM1_X, parseInt(data.L_FM1_Y) + offset, data.L_FM1_Z);
                    break;
                case "L_FM2":
                    d.position.set(data.L_FM2_X, parseInt(data.L_FM2_Y) + offset, data.L_FM2_Z);
                    break;
                case "L_FM5":
                    d.position.set(data.L_FM5_X, parseInt(data.L_FM5_Y) + offset, data.L_FM5_Z);
                    break;
                case "L_FME":
                    d.position.set(data.L_FME_X, parseInt(data.L_FME_Y) + offset, data.L_FME_Z);
                    break;
                case "L_FTC":
                    d.position.set(data.L_FTC_X, parseInt(data.L_FTC_Y) + offset, data.L_FTC_Z);
                    break;
                case "L_HLE":
                    d.position.set(data.L_HLE_X, parseInt(data.L_HLE_Y) + offset, data.L_HLE_Z);
                    break;
                case "L_HM2":
                    d.position.set(data.L_HM2_X, parseInt(data.L_HM2_Y) + offset, data.L_HM2_Z);
                    break;
                case "L_HM5":
                    d.position.set(data.L_HM5_X, parseInt(data.L_HM5_Y) + offset, data.L_HM5_Z);
                    break;
                case "L_HME":
                    d.position.set(data.L_HME_X, parseInt(data.L_HME_Y) + offset, data.L_HME_Z);
                    break;
                case "L_IAS":
                    d.position.set(data.L_IAS_X, parseInt(data.L_IAS_Y) + offset, data.L_IAS_Z);
                    break;
                case "L_IPS":
                    d.position.set(data.L_IPS_X, parseInt(data.L_IPS_Y) + offset, data.L_IPS_Z);
                    break;
                case "L_RSP":
                    d.position.set(data.L_RSP_X, parseInt(data.L_RSP_Y) + offset, data.L_RSP_Z);
                    break;
                case "L_SAA":
                    d.position.set(data.L_SAA_X, parseInt(data.L_SAA_Y) + offset, data.L_SAA_Z);
                    break;
                case "L_SAE":
                    d.position.set(data.L_SAE_X, parseInt(data.L_SAE_Y) + offset, data.L_SAE_Z);
                    break;
                case "L_SIA":
                    d.position.set(data.L_SIA_X, parseInt(data.L_SIA_Y) + offset, data.L_SIA_Z);
                    break;
                case "L_SRS":
                    d.position.set(data.L_SRS_X, parseInt(data.L_SRS_Y) + offset, data.L_SRS_Z);
                    break;
                case "L_TAM":
                    d.position.set(data.L_TAM_X, parseInt(data.L_TAM_Y) + offset, data.L_TAM_Z);
                    break;
                case "L_TTC":
                    d.position.set(data.L_TTC_X, parseInt(data.L_TTC_Y) + offset, data.L_TTC_Z);
                    break;
                case "L_UHE":
                    d.position.set(data.L_UHE_X, parseInt(data.L_UHE_Y) + offset, data.L_UHE_Z);
                    break;
                case "L_UOA":
                    d.position.set(data.L_UOA_X, parseInt(data.L_UOA_Y) + offset, data.L_UOA_Z);
                    break;
                case "R_FAL":
                    d.position.set(data.R_FAL_X, parseInt(data.R_FAL_Y) + offset, data.R_FAL_Z);
                    break;
                case "R_FAX":
                    d.position.set(data.R_FAX_X, parseInt(data.R_FAX_Y) + offset, data.R_FAX_Z);
                    break;
                case "R_FCC":
                    d.position.set(data.R_FCC_X, parseInt(data.R_FCC_Y) + offset, data.R_FCC_Z);
                    break;
                case "R_FLE":
                    d.position.set(data.R_FLE_X, parseInt(data.R_FLE_Y) + offset, data.R_FLE_Z);
                    break;
                case "R_FM1":
                    d.position.set(data.R_FM1_X, parseInt(data.R_FM1_Y) + offset, data.R_FM1_Z);
                    break;
                case "R_FM2":
                    d.position.set(data.R_FM2_X, parseInt(data.R_FM2_Y) + offset, data.R_FM2_Z);
                    break;
                case "R_FM5":
                    d.position.set(data.R_FM5_X, parseInt(data.R_FM5_Y) + offset, data.R_FM5_Z);
                    break;
                case "R_FME":
                    d.position.set(data.R_FME_X, parseInt(data.R_FME_Y) + offset, data.R_FME_Z);
                    break;
                case "R_FTC":
                    d.position.set(data.R_FTC_X, parseInt(data.R_FTC_Y) + offset, data.R_FTC_Z);
                    break;
                case "R_HLE":
                    d.position.set(data.R_HLE_X, parseInt(data.R_HLE_Y) + offset, data.R_HLE_Z);
                    break;
                case "R_HM2":
                    d.position.set(data.R_HM2_X, parseInt(data.R_HM2_Y) + offset, data.R_HM2_Z);
                    break;
                case "R_HM5":
                    d.position.set(data.R_HM5_X, parseInt(data.R_HM5_Y) + offset, data.R_HM5_Z);
                    break;
                case "R_HME":
                    d.position.set(data.R_HME_X, parseInt(data.R_HME_Y) + offset, data.R_HME_Z);
                    break;
                case "R_IAS":
                    d.position.set(data.R_IAS_X, parseInt(data.R_IAS_Y) + offset, data.R_IAS_Z);
                    break;
                case "R_IPS":
                    d.position.set(data.R_IPS_X, parseInt(data.R_IPS_Y) + offset, data.R_IPS_Z);
                    break;
                case "R_RSP":
                    d.position.set(data.R_RSP_X, parseInt(data.R_RSP_Y) + offset, data.R_RSP_Z);
                    break;
                case "R_SAA":
                    d.position.set(data.R_SAA_X, parseInt(data.R_SAA_Y) + offset, data.R_SAA_Z);
                    break;
                case "R_SAE":
                    d.position.set(data.R_SAE_X, parseInt(data.R_SAE_Y) + offset, data.R_SAE_Z);
                    break;
                case "R_SIA":
                    d.position.set(data.R_SIA_X, parseInt(data.R_SIA_Y) + offset, data.R_SIA_Z);
                    break;
                case "R_SRS":
                    d.position.set(data.R_SRS_X, parseInt(data.R_SRS_Y) + offset, data.R_SRS_Z);
                    break;
                case "R_TAM":
                    d.position.set(data.R_TAM_X, parseInt(data.R_TAM_Y) + offset, data.R_TAM_Z);
                    break;
                case "R_TTC":
                    d.position.set(data.R_TTC_X, parseInt(data.R_TTC_Y) + offset, data.R_TTC_Z);
                    break;
                case "R_UHE":
                    d.position.set(data.R_UHE_X, parseInt(data.R_UHE_Y) + offset, data.R_UHE_Z);
                    break;
                case "R_UOA":
                    d.position.set(data.R_UOA_X, parseInt(data.R_UOA_Y) + offset, data.R_UOA_Z);
                    break;
                case "SJN":
                    d.position.set(data.SJN_X, parseInt(data.SJN_Y) + offset, data.SJN_Z);
                    break;
                case "SXS":
                    d.position.set(data.SXS_X, parseInt(data.SXS_Y) + offset, data.SXS_Z);
                    break;
                case "TV10":
                    d.position.set(data.TV10_X, parseInt(data.TV10_Y) + offset, data.TV10_Z);
                    break;
                default:
                    ;
            }
        });
    }
}

function loadParticipantsDataToFilter(pList){
    minAge = 100, maxAge = 0, minW = 400, maxW =0, minH = 300, maxH = 0;
    
    //Subset demographic data to current participant selection
    filterDemo = demo_data.filter(function(d,i){
        return participants.indexOf(d.ID) >= 0
    });

    //Get min and max of subset variables
    for (let i = 0; i<filterDemo.length; i++){
        //Age
        if(parseInt(filterDemo[i].Age) < minAge)
            minAge = parseInt(filterDemo[i].Age);
        if(parseInt(filterDemo[i].Age) > maxAge)
            maxAge = parseInt(filterDemo[i].Age);

        //Height
        if((parseFloat(filterDemo[i].Height).toFixed(2))*100 < minH)
            minH = parseFloat(parseFloat(filterDemo[i].Height).toFixed(2)) *100;
        if((parseFloat(filterDemo[i].Height).toFixed(2))*100 > maxH)
            maxH = parseFloat(parseFloat(filterDemo[i].Height).toFixed(2))*100;

        minH = parseInt(minH);
        maxH = parseInt(maxH);

        //Weight
        if(parseFloat(filterDemo[i].Weight) < minW)
            minW = parseInt(filterDemo[i].Weight);
        if(parseFloat(filterDemo[i].Weight) > maxW)
            maxW = parseInt(filterDemo[i].Weight);
    }

    //Update the Age slider
    leftAge = minAge, rightAge = maxAge;
    document.getElementsByClassName("age-slider-input")[0].setAttribute("min", minAge);
    document.getElementsByClassName("age-slider-input")[1].setAttribute("min", minAge);
    document.getElementsByClassName("age-slider-input")[0].setAttribute("max", maxAge);
    document.getElementsByClassName("age-slider-input")[1].setAttribute("max", maxAge);
    document.getElementsByClassName("age-slider-input")[0].setAttribute("value", leftAge); // minAge +5
    document.getElementsByClassName("age-slider-input")[1].setAttribute("value", rightAge); // maxAge -5

    sliderLowerHandleController(document.getElementsByClassName("age-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("age-slider-input")[1]);

    document.getElementsByClassName("age-slider-input")[0].addEventListener("click", ageSlider);
    document.getElementsByClassName("age-slider-input")[1].addEventListener("click", ageSlider);

    //Update the Height slider
    document.getElementsByClassName("height-slider-input")[0].setAttribute("step", 1);
    document.getElementsByClassName("height-slider-input")[1].setAttribute("step", 1);
    document.getElementsByClassName("height-slider-input")[0].setAttribute("min", minH);
    document.getElementsByClassName("height-slider-input")[1].setAttribute("min", minH);
    document.getElementsByClassName("height-slider-input")[0].setAttribute("max", maxH);
    document.getElementsByClassName("height-slider-input")[1].setAttribute("max", maxH);
    document.getElementsByClassName("height-slider-input")[0].setAttribute("value", leftHeight ); // minH
    document.getElementsByClassName("height-slider-input")[1].setAttribute("value", rightHeight ); // maxH

    sliderLowerHandleController(document.getElementsByClassName("height-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("height-slider-input")[1]);

    document.getElementsByClassName("height-slider-input")[0].addEventListener("click", heightSlider);
    document.getElementsByClassName("height-slider-input")[1].addEventListener("click", heightSlider);

    //Update the Weight slider
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("min", minW);
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("min", minW);
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("max", maxW);
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("max", maxW);
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("value", leftWeight); // minW +1
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("value", rightWeight ); // maxW
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("step", 0.5);
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("step", 0.5);

    sliderLowerHandleController(document.getElementsByClassName("weight-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("weight-slider-input")[1]);

    document.getElementsByClassName("weight-slider-input")[0].addEventListener("click", weightSlider);
    document.getElementsByClassName("weight-slider-input")[1].addEventListener("click", weightSlider);

    //Update data when Filter button is clicked
    document.getElementById("filter-btn").addEventListener("click", filterData);

    //Load participant IDs to current selectors
    for(let i = 0; i< pList.length; i++) {
        document.querySelector("#participant-list").innerHTML += "\n<option value=\"" + pList[i] + "\">" + pList[i] + "</option>";
    }
}

//Call this function everytime the filter changes => filter demo changes
function handleMainViewText(lowerAge, upperAge, lowerHeight, upperHeight, lowerWeight, upperWeight){
    var topText = document.getElementById("info-main-view-top");
    var sideText = document.getElementById("info-main-view-side");
    var bottomText = document.getElementById("info-main-view-bottom");

    topText.innerHTML = "<p>Speed: " + speed + "/5<span class=\"tab\"></span>Trial: " + trial + "/5<span class=\"tab\"></span>Age: "
                        + lowerAge + "-" + upperAge+"<span class=\"tab\"></span>Height: " +
                        lowerHeight + "-" + upperHeight+ " m<span class=\"tab\"></span>Weight: " +
                        lowerWeight + "-" + upperWeight +" kg</p>";
    bottomText.innerHTML = "<p>Showing " + filterDemo.length + " participants</p>"
    //Make visible
    topText.style.visibility = "visible";
    sideText.style.visibility = "visible";
    bottomText.style.visibility = "visible";

    isParticipantSelected = true;
    handleParticipantText(filterDemo[0]);
}

//Call this function whenever a participant is selected, pass demo row for participant
function handleParticipantText(participant){
    var sideText = document.getElementById("info-main-view-side")
    if (isParticipantSelected) {
        document.getElementById("info-main-view-top").style.width = "77%";
        sideText.style.visibility = "visible";
        //console.log(participant);
        var gender;
        if (participant.Gender == "0.0")
            gender = "Female";
        else
            gender = "Male";

        sideText.innerHTML = "<p>P" + participant.ID +"</p>" +
            "<p>Gender: " + gender + "</p>" +
            "<p>Age: " + parseInt(participant.Age) + "</p>" +
            "<p>Height: " + parseFloat(participant.Height).toFixed(2)+" cm</p>" +
            "<p>Weight: " + parseFloat(participant.Weight).toFixed(2)+" kg</p>" +
            "<p>Left leg: " + parseFloat(participant.Left_leg_length).toFixed(3)+" cm</p>" +
            "<p>Right leg: " + parseFloat(participant.Right_leg_length).toFixed(3)+" cm</p>" ;

    } else {
        document.getElementById("info-main-view-top").style.width = "100%";
        document.getElementById("info-main-view-side").style.visibility = "hidden";
    }
}

loadData();