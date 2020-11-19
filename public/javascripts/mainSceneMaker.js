// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

let markers_data = [];
let demo_data = []; //0 = woman  1 = man
let participants = [];
let participantsData = [];
let markerByParticipant, participant, timestamp = [];
let trial = "1", speed = "1", offsetY = 0;
let filterDemo;

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2)/ (window.innerHeight*0.9) , 0.1, 10000 );
camera.up.set(0, 0, 1);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize( (window.innerWidth/2),window.innerHeight *0.9);

//Adding orbit controls to rotate , zoom and pan
scene.controls = new OrbitControls(camera, renderer.domElement);
scene.controls.mouseButtons = {
     LEFT: THREE.MOUSE.ROTATE,
     MIDDLE: THREE.MOUSE.DOLLY,
     RIGHT: THREE.MOUSE.PAN
}

document.getElementById("main-scene").appendChild( renderer.domElement );
drawGrid();
function onWindowResize() {
    camera.aspect = (window.innerWidth/2) /(window.innerHeight*0.9);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth/2),window.innerHeight*0.9);
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
        const groupChildren = scene.children.filter(child => child.type === "Group")
        groupChildren.forEach(function (d,i) {
            if (timestamp[i] >= participantsData[i].length){
                timestamp[i] = 0;
            }
            else{
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
        });
    }

    renderer.render( scene, camera );
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

var leftAge, rightAge, minAge, maxAge;

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

var leftHeight, rightHeight, minH, maxH;

function heightSlider() {
    leftHeight = document.getElementsByClassName("height-slider-input")[0];
    rightHeight = document.getElementsByClassName("height-slider-input")[1];
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (Math.floor(d.userData.height) >= parseInt(leftHeight.value) && Math.floor(d.userData.height) <= parseInt(rightHeight.value))
            d.visible = true;
        else {
            d.visible = false;
        }
    });
}

var leftWeight, rightWeight, minW, maxW;

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

    animate();
}

function drawGrid(){
    let size = 5000;
    let division = 20;
    const gridHelper = new THREE.GridHelper( size, division );
    gridHelper.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI / 180 ) )
    scene.add( gridHelper );
}

function drawPoint(geometry, x,y,z,pid, joint){
    let meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.color.setHex(0xeb3434);
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.x = x;
    mesh.position.y = z;
    mesh.position.z =y;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1000;

    //If needed to add later data to points
    mesh.userData = {id: pid, joint: joint};
    return mesh;
}

function drawHumanDots(humanData, offset){
    //dot geometry
    let geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 0.01);
    participant = new THREE.Group();

    participant.add(drawPoint(geometry, humanData.CV7_X, parseInt(humanData.CV7_Y) + offset, humanData.CV7_Z, humanData.Participant, "CV7"));
    participant.add(drawPoint(geometry, humanData.L_FAL_X, parseInt(humanData.L_FAL_Y) + offset, humanData.L_FAL_Z, humanData.Participant, "L_FAL"));
    participant.add(drawPoint(geometry, humanData.L_FAX_X, parseInt(humanData.L_FAX_Y) + offset, humanData.L_FAX_Z, humanData.Participant, "L_FAX"));
    participant.add(drawPoint(geometry, humanData.L_FCC_X, parseInt(humanData.L_FCC_Y) + offset, humanData.L_FCC_Z, humanData.Participant, "L_FCC"));
    participant.add(drawPoint(geometry, humanData.L_FLE_X, parseInt(humanData.L_FLE_Y) + offset, humanData.L_FLE_Z, humanData.Participant, "L_FLE"));
    participant.add(drawPoint(geometry, humanData.L_FM1_X, parseInt(humanData.L_FM1_Y) + offset, humanData.L_FM1_Z, humanData.Participant, "L_FM1"));
    participant.add(drawPoint(geometry, humanData.L_FM2_X, parseInt(humanData.L_FM2_Y) + offset, humanData.L_FM2_Z, humanData.Participant, "L_FM2"));
    participant.add(drawPoint(geometry, humanData.L_FM5_X, parseInt(humanData.L_FM5_Y) + offset, humanData.L_FM5_Z, humanData.Participant, "L_FM5"));
    participant.add(drawPoint(geometry, humanData.L_FME_X, parseInt(humanData.L_FME_Y) + offset, humanData.L_FME_Z, humanData.Participant, "L_FME"));
    participant.add(drawPoint(geometry, humanData.L_FTC_X, parseInt(humanData.L_FTC_Y) + offset, humanData.L_FTC_Z, humanData.Participant, "L_FTC"));
    participant.add(drawPoint(geometry, humanData.L_HLE_X, parseInt(humanData.L_HLE_Y) + offset, humanData.L_HLE_Z, humanData.Participant, "L_HLE"));
    participant.add(drawPoint(geometry, humanData.L_HM2_X, parseInt(humanData.L_HM2_Y) + offset, humanData.L_HM2_Z, humanData.Participant, "L_HM2"));
    participant.add(drawPoint(geometry, humanData.L_HM5_X, parseInt(humanData.L_HM5_Y) + offset, humanData.L_HM5_Z, humanData.Participant, "L_HM5"));
    participant.add(drawPoint(geometry, humanData.L_HME_X, parseInt(humanData.L_HME_Y) + offset, humanData.L_HME_Z, humanData.Participant, "L_HME"));
    participant.add(drawPoint(geometry, humanData.L_IAS_X, parseInt(humanData.L_IAS_Y) + offset, humanData.L_IAS_Z, humanData.Participant, "L_IAS"));
    participant.add(drawPoint(geometry, humanData.L_IPS_X, parseInt(humanData.L_IPS_Y) + offset, humanData.L_IPS_Z, humanData.Participant, "L_IPS"));
    participant.add(drawPoint(geometry, humanData.L_RSP_X, parseInt(humanData.L_RSP_Y) + offset, humanData.L_RSP_Z, humanData.Participant, "L_RSP"));
    participant.add(drawPoint(geometry, humanData.L_SAA_X, parseInt(humanData.L_SAA_Y) + offset, humanData.L_SAA_Z, humanData.Participant, "L_SAA"));
    participant.add(drawPoint(geometry, humanData.L_SAE_X, parseInt(humanData.L_SAE_Y) + offset, humanData.L_SAE_Z, humanData.Participant, "L_SAE"));
    participant.add(drawPoint(geometry, humanData.L_SIA_X, parseInt(humanData.L_SIA_Y) + offset, humanData.L_SIA_Z, humanData.Participant, "L_SIA"));
    participant.add(drawPoint(geometry, humanData.L_SRS_X, parseInt(humanData.L_SRS_Y) + offset, humanData.L_SRS_Z, humanData.Participant, "L_SRS"));
    participant.add(drawPoint(geometry, humanData.L_TAM_X, parseInt(humanData.L_TAM_Y) + offset, humanData.L_TAM_Z, humanData.Participant, "L_TAM"));
    participant.add(drawPoint(geometry, humanData.L_TTC_X, parseInt(humanData.L_TTC_Y) + offset, humanData.L_TTC_Z, humanData.Participant, "L_TTC"));
    participant.add(drawPoint(geometry, humanData.L_UHE_X, parseInt(humanData.L_UHE_Y) + offset, humanData.L_UHE_Z, humanData.Participant, "L_UHE"));
    participant.add(drawPoint(geometry, humanData.L_UOA_X, parseInt(humanData.L_UOA_Y) + offset, humanData.L_UOA_Z, humanData.Participant, "L_UOA"));
    participant.add(drawPoint(geometry, humanData.R_FAL_X, parseInt(humanData.R_FAL_Y) + offset, humanData.R_FAL_Z, humanData.Participant, "R_FAL"));
    participant.add(drawPoint(geometry, humanData.R_FAX_X, parseInt(humanData.R_FAX_Y) + offset, humanData.R_FAX_Z, humanData.Participant, "R_FAX"));
    participant.add(drawPoint(geometry, humanData.R_FCC_X, parseInt(humanData.R_FCC_Y) + offset, humanData.R_FCC_Z, humanData.Participant, "R_FCC"));
    participant.add(drawPoint(geometry, humanData.R_FLE_X, parseInt(humanData.R_FLE_Y) + offset, humanData.R_FLE_Z, humanData.Participant, "R_FLE"));
    participant.add(drawPoint(geometry, humanData.R_FM1_X, parseInt(humanData.R_FM1_Y) + offset, humanData.R_FM1_Z, humanData.Participant, "R_FM1"));
    participant.add(drawPoint(geometry, humanData.R_FM2_X, parseInt(humanData.R_FM2_Y) + offset, humanData.R_FM2_Z, humanData.Participant, "R_FM2"));
    participant.add(drawPoint(geometry, humanData.R_FM5_X, parseInt(humanData.R_FM5_Y) + offset, humanData.R_FM5_Z, humanData.Participant, "R_FM5"));
    participant.add(drawPoint(geometry, humanData.R_FME_X, parseInt(humanData.R_FME_Y) + offset, humanData.R_FME_Z, humanData.Participant, "R_FME"));
    participant.add(drawPoint(geometry, humanData.R_FTC_X, parseInt(humanData.R_FTC_Y) + offset, humanData.R_FTC_Z, humanData.Participant, "R_FTC"));
    participant.add(drawPoint(geometry, humanData.R_HLE_X, parseInt(humanData.R_HLE_Y) + offset, humanData.R_HLE_Z, humanData.Participant, "R_HLE"));
    participant.add(drawPoint(geometry, humanData.R_HM2_X, parseInt(humanData.R_HM2_Y) + offset, humanData.R_HM2_Z, humanData.Participant, "R_HM2"));
    participant.add(drawPoint(geometry, humanData.R_HM5_X, parseInt(humanData.R_HM5_Y) + offset, humanData.R_HM5_Z, humanData.Participant, "R_HM5"));
    participant.add(drawPoint(geometry, humanData.R_HME_X, parseInt(humanData.R_HME_Y) + offset, humanData.R_HME_Z, humanData.Participant, "R_HME"));
    participant.add(drawPoint(geometry, humanData.R_IAS_X, parseInt(humanData.R_IAS_Y) + offset, humanData.R_IAS_Z, humanData.Participant, "R_IAS"));
    participant.add(drawPoint(geometry, humanData.R_IPS_X, parseInt(humanData.R_IPS_Y) + offset, humanData.R_IPS_Z, humanData.Participant, "R_IPS"));
    participant.add(drawPoint(geometry, humanData.R_RSP_X, parseInt(humanData.R_RSP_Y) + offset, humanData.R_RSP_Z, humanData.Participant, "R_RSP"));
    participant.add(drawPoint(geometry, humanData.R_SAA_X, parseInt(humanData.R_SAA_Y) + offset, humanData.R_SAA_Z, humanData.Participant, "R_SAA"));
    participant.add(drawPoint(geometry, humanData.R_SAE_X, parseInt(humanData.R_SAE_Y) + offset, humanData.R_SAE_Z, humanData.Participant, "R_SAE"));
    participant.add(drawPoint(geometry, humanData.R_SIA_X, parseInt(humanData.R_SIA_Y) + offset, humanData.R_SIA_Z, humanData.Participant, "R_SIA"));
    participant.add(drawPoint(geometry, humanData.R_SRS_X, parseInt(humanData.R_SRS_Y) + offset, humanData.R_SRS_Z, humanData.Participant, "R_SRS"));
    participant.add(drawPoint(geometry, humanData.R_TAM_X, parseInt(humanData.R_TAM_Y) + offset, humanData.R_TAM_Z, humanData.Participant, "R_TAM"));
    participant.add(drawPoint(geometry, humanData.R_TTC_X, parseInt(humanData.R_TTC_Y) + offset, humanData.R_TTC_Z, humanData.Participant, "R_TTC"));
    participant.add(drawPoint(geometry, humanData.R_UHE_X, parseInt(humanData.R_UHE_Y) + offset, humanData.R_UHE_Z, humanData.Participant, "R_UHE"));
    participant.add(drawPoint(geometry, humanData.R_UOA_X, parseInt(humanData.R_UOA_Y) + offset, humanData.R_UOA_Z, humanData.Participant, "R_UOA"));
    participant.add(drawPoint(geometry, humanData.SJN_X, parseInt(humanData.SJN_Y) + offset, humanData.SJN_Z, humanData.Participant, "SJN"));
    participant.add(drawPoint(geometry, humanData.SXS_X, parseInt(humanData.SXS_Y) + offset, humanData.SXS_Z, humanData.Participant, "SXS"));
    participant.add(drawPoint(geometry, humanData.TV10_X, parseInt(humanData.TV10_Y) + offset, humanData.TV10_Z, humanData.Participant, "TV10"));

    participant.userData = {id: humanData.Participant, 
                            offset: offset, 
                            gender: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Gender,
                            age: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Age,
                            weight: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Weight,
                            height: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Height};
    scene.add(participant);
    console.log("done adding participant");
}

function move(data, person){
    if (typeof data !== 'undefined'){
        let offset = parseInt(person.userData.offset);
        person.children.forEach(function (d) {
            let joint = d.userData.joint;

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

loadData();