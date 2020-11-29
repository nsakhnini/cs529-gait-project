// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import * as humanoidMaker from './humanoidMaker.js';
import * as topViewMaker from './topViewHandler.js';
import {filterData} from './dataHandler.js';

let footsteps_data = [];
let participants = [];
let participantsData = [];
let participantsState = [];
let participantsTS = [];
export let participantsDirection = [];
let markerByParticipant, timestamp = [];
export let trial = "1", speed = "1", offsetY = -250;
export let filterDemo, filterMarkers, filterFootsteps;

var leftAge, rightAge, minAge, maxAge;
var leftHeight, rightHeight, minH, maxH;
var leftWeight, rightWeight, minW, maxW;

let midPoint;
let quaternion = new THREE.Quaternion();
let fromVector, toVector, fromP1, fromP2, toP1, toP2;

let direction;
let frameDelayCounter = 0;

let isParticipantSelected = false;
let backX, backY, backZ;
let printedDataPerson = false;

export let selectedParticipant, selectedParticipantDemo, selectedParticipantFootsteps; //To be connected for direct manipulation participant selection

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x010101 );

export const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2)/ (window.innerHeight*0.5) , 0.1, 100000 );
camera.up.set(0, 0, 1);

export const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
});
renderer.setSize( (window.innerWidth/2),window.innerHeight *0.5);

//Adding orbit controls to rotate , zoom and pan
scene.controls = new OrbitControls(camera, renderer.domElement);
scene.controls.enableKeys = true;
scene.controls.mouseButtons = {
    LEFT:THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}
scene.controls.keys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
}
let mainScene = document.getElementById("main-scene")
    mainScene.appendChild( renderer.domElement );
    mainScene.tabIndex = -1;
let sceneKeyEvents = document.body;
let movementVector = new THREE.Vector3();
sceneKeyEvents.addEventListener("keydown",(ev)=>{
    switch (ev.key) {
        case 'ArrowUp':{
            camera.getWorldDirection(movementVector);
            movementVector.z = 0;
            movementVector.multiplyScalar(50);
            camera.position.add(movementVector );
            break;
        }
        case 'ArrowDown':{
            camera.getWorldDirection(movementVector);
            movementVector.z = 0;
            movementVector.multiplyScalar(-50);
            camera.position.add(movementVector );
            break;
        }
        case 'ArrowLeft':{
            camera.getWorldDirection(movementVector);
            let eulerRot = new THREE.Euler(0,0,1.52,'XYZ');
            movementVector.z = 0;
            movementVector.applyEuler(eulerRot);
            movementVector.multiplyScalar(50);
            camera.position.add( movementVector);
            break;
        }
        case 'ArrowRight':{
            camera.getWorldDirection(movementVector);
            let eulerRot = new THREE.Euler(0,0,1.52,'XYZ');
            movementVector.z = 0;
            movementVector.applyEuler(eulerRot);
            movementVector.multiplyScalar(-50);
            camera.position.add(movementVector );
            break;
        }
    }
})
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

    // limit frames number untill the animation is done (one loop)
    // if(frameCounter > 275) return;
    // wait for the number of frames to starty the animation (add delay after every loop)

    requestAnimationFrame( animate );
    if(frameDelayCounter < 10){
        frameDelayCounter++;
    } else {
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
                        participantsState[i] = 0; //zero means ended
                    } else {
                        timestamp[i] += 1;
                    }

                    direction = participantsDirection.filter(function (w) {
                        return w.id == d.userData.id;
                    });
                    if(participantsState[i] !== 0){
                        if ( direction[0].dir == 0) {
                            move(participantsData[i][timestamp[i]], d, i);
                        }
                        else {
                            move(participantsData[i][timestamp[i]], d, i);
                            d.rotation.z = Math.PI;
                        }
                    }
                }
            });
            if(!participantsState.includes(1)){
                participantsState = participantsState.map(value=>{return 1});
                timestamp = timestamp.map(value=>{return 0});
                frameDelayCounter = 0;
            }
        }
    }

    //Update Axes Helper
    axesHelperCamera.position.subVectors(camera.position, scene.controls.target);
    axesHelperCamera.position.setLength(100);
    axesHelperCamera.lookAt(axesHelperScene.position);

    renderer.render( scene, camera );
    axesHelperRenderer.render(axesHelperScene, axesHelperCamera);
};

function localFilterData() {
    var isFemaleChk = document.getElementById("female-check").checked;
    var isMaleChk = document.getElementById("male-check").checked;

    //Needs to be removed or better way to hide
    const groupChildren = scene.children.filter(child => child.type === "Group")
    groupChildren.forEach(function (d) {
        if (d.userData.gender == 0) {
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

export async function load3DView(){
    markerByParticipant = d3.group(filterMarkers, d => d.Participant, d=>d.Speed, d=>d.Trial);
    var iterator = markerByParticipant.keys();
    var pID = iterator.next().value;

    while (typeof pID !==  "undefined") {
        participants.push(pID);
        participantsData.push(
            markerByParticipant.get(pID).get(String(speed)).get(String(trial))
        );
        participantsState.push(1); //1 is ready to move
        participantsTS.push(markerByParticipant.get(pID).get(String(speed)).get(String(trial)).length)
        if (parseFloat(markerByParticipant.get(pID).get(String(speed)).get(String(trial))[0].L_FCC_X) > parseFloat(markerByParticipant.get(pID).get(String(speed)).get(String(trial))[0].L_FM2_X)) {
            participantsDirection.push({id: pID, dir: 1});
        } else if (parseFloat(markerByParticipant.get(pID).get(String(speed)).get(String(trial))[0].L_FCC_X) < parseFloat(markerByParticipant.get(pID).get(String(speed)).get(String(trial))[0].L_FM2_X)) {
            participantsDirection.push({id: pID, dir: 0});
        }

        pID = iterator.next().value;
    }

    for (let i = 0; i<participants.length; i++){
        //Change offset at X for rows (in front of each other)
        drawHumanDots(participantsData[i][0], offsetY);
        offsetY = offsetY +1000;
    }

    loadParticipantsDataToFilter(participants);

    camera.position.x =-3238;
    camera.position.y = 107.15;
    camera.position.z =231.33;

    camera.rotation.x = -1.72353
    camera.rotation.y = -1.3973
    camera.rotation.z = 2.99

    handleMainViewText(20,50,1.4,1.9,45,200);
    console.log(scene);
    animate();
    scene.scale.x = 1;
    scene.scale.y = 1;
    scene.scale.z = 1;
}

function drawGrid(){
    let size = 50000;
    let division = 20;
    const gridHelper = new THREE.GridHelper( size, division );
    gridHelper.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI / 180 ) )
    scene.add( gridHelper );
}

function drawHumanDots(humanData, offset){
    humanoidMaker.createHumanoid(humanData, offset, filterDemo, scene);
}

function move(data, person, personIndex){
    if(!printedDataPerson){
        printedDataPerson = true;
    }
    if (typeof data !== 'undefined'){
        let offsetX,offsetY,offsetZ, frameZ;
        frameZ = participantsData[personIndex][0];

        offsetX = (parseFloat(frameZ.L_FCC_Z) <= parseFloat(frameZ.R_FCC_Z))? parseFloat(frameZ.L_FCC_X): parseFloat(frameZ.R_FCC_X);
        offsetY = (parseFloat(frameZ.L_FCC_Z) <= parseFloat(frameZ.R_FCC_Z))? parseFloat(frameZ.L_FCC_Y): parseFloat(frameZ.R_FCC_Y);
        offsetZ = (parseFloat(frameZ.L_FCC_Z) <= parseFloat(frameZ.R_FCC_Z))? parseFloat(frameZ.L_FCC_Z): parseFloat(frameZ.R_FCC_Z);

        person.children.forEach(function (d) {
            let joint = d.userData.joint;
            if (typeof joint === 'undefined'){
                d.children.forEach(function (v, index, array) {
                    if (v.userData.part === "back"){
                        midPoint = [(parseFloat(data[v.userData.point2[0]]) + parseFloat(data[v.userData.point2[3]])) / 2 ,
                            ((parseFloat(data[v.userData.point2[1]]) + parseFloat(data[v.userData.point2[4]])) / 2) ,
                            (parseFloat(data[v.userData.point2[2]]) + parseFloat(data[v.userData.point2[5]])) / 2]    ;

                        if(isNaN(parseFloat(data[v.userData.point1[0]]))){
                            backX = (parseFloat(data.R_SAE_X) + parseFloat(data.L_SAE_X))/2;
                            backY = (parseFloat(data.R_SAE_Y) + parseFloat(data.L_SAE_Y))/2;
                            backZ = (parseFloat(data.R_SAE_Z) + parseFloat(data.L_SAE_Z))/2;
                        }else{
                            backX = parseFloat(data[v.userData.point1[0]]);
                            backY = parseFloat(data[v.userData.point1[1]]);
                            backZ = parseFloat(data[v.userData.point1[2]]);
                        }
                        v.position.x = ((backX + midPoint[0]) / 2) - offsetX;
                        v.position.y = ((backY + midPoint[1]) / 2) - offsetY;
                        v.position.z = (backZ+ midPoint[2]) / 2 - offsetZ;

                        fromP1 = new THREE.Vector3(parseFloat(v.userData.p1data[0]), parseFloat(v.userData.p1data[1]), parseFloat(v.userData.p1data[2]));
                        fromP2 = new THREE.Vector3((parseFloat(v.userData.mid1data[0]) + parseFloat(v.userData.mid2data[0]))/2,
                            (parseFloat(v.userData.mid1data[1]) + parseFloat(v.userData.mid2data[1]))/2,
                            (parseFloat(v.userData.mid1data[2]) + parseFloat(v.userData.mid2data[2]))/2);

                        fromVector = new THREE.Vector3().subVectors(fromP2, fromP1);

                        toP1 = new THREE.Vector3(backX,backY,backZ);
                        toP2 = new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]);

                        v.userData.p1data = [toP1.x, toP1.y, toP1.z];
                        v.userData.mid1data = [parseFloat(data[v.userData.point2[0]]), parseFloat(data[v.userData.point2[1]]), parseFloat(data[v.userData.point2[2]])];
                        v.userData.mid2data = [parseFloat(data[v.userData.point2[3]]), parseFloat(data[v.userData.point2[4]]), parseFloat(data[v.userData.point2[5]])];

                        toVector = new THREE.Vector3().subVectors(toP2, toP1);

                        quaternion.setFromUnitVectors(fromVector.normalize(), toVector.normalize());//To normalize vector to unit vector .normalize()

                        v.applyQuaternion(quaternion);
                    }
                    else{
                        //Handle shoulders for missing backpoints
                        if(isNaN(parseFloat(data[v.userData.point1[0]]))){
                            data[v.userData.point1[0]] = (parseFloat(data.R_SAE_X) + parseFloat(data.L_SAE_X))/2;
                            data[v.userData.point1[1]] = (parseFloat(data.R_SAE_Y) + parseFloat(data.L_SAE_Y))/2;
                            data[v.userData.point1[2]] = (parseFloat(data.R_SAE_Z) + parseFloat(data.L_SAE_Z))/2;
                        }
                        if(isNaN(parseFloat(data[v.userData.point2[0]]))){
                            data[v.userData.point2[0]] = (parseFloat(data.R_SAE_X) + parseFloat(data.L_SAE_X))/2;
                            data[v.userData.point2[1]] = (parseFloat(data.R_SAE_Y) + parseFloat(data.L_SAE_Y))/2;
                            data[v.userData.point2[2]] = (parseFloat(data.R_SAE_Z) + parseFloat(data.L_SAE_Z))/2;
                        }

                        v.position.x = ((parseFloat(data[v.userData.point1[0]]) + parseFloat(data[v.userData.point2[0]])) / 2) - offsetX;
                        v.position.y = ((parseFloat(data[v.userData.point1[1]]) + parseFloat(data[v.userData.point2[1]])) / 2) - offsetY;
                        v.position.z = (parseFloat(data[v.userData.point1[2]]) + parseFloat(data[v.userData.point2[2]])) / 2 - offsetZ;

                        fromP1 = new THREE.Vector3(parseFloat(v.userData.p1data[0]), parseFloat(v.userData.p1data[1]), parseFloat(v.userData.p1data[2]));
                        fromP2 = new THREE.Vector3(parseFloat(v.userData.p2data[0]), parseFloat(v.userData.p2data[1]), parseFloat(v.userData.p2data[2]));

                        fromVector = new THREE.Vector3().subVectors(fromP2, fromP1);

                        toP1 = new THREE.Vector3(parseFloat(data[v.userData.point1[0]]) - offsetX,parseFloat(data[v.userData.point1[1]]) - offsetY ,parseFloat(data[v.userData.point1[2]]) - offsetZ);
                        toP2 = new THREE.Vector3(parseFloat(data[v.userData.point2[0]])-offsetX,parseFloat(data[v.userData.point2[1]])-offsetY,parseFloat(data[v.userData.point2[2]])-offsetZ);

                        v.userData.p1data = [toP1.x, toP1.y, toP1.z];
                        v.userData.p2data = [toP2.x, toP2.y, toP2.z];

                        toVector = new THREE.Vector3().subVectors(toP2, toP1);

                        quaternion.setFromUnitVectors(fromVector.normalize(), toVector.normalize());//To normalize vector to unit vector .normalize()

                        v.applyQuaternion(quaternion);
                    }
                })
            }
            function setPointPosition(d,x,offsetX,y,offsetY,z,offsetZ){

            }
            switch (joint) {
                case "CV7":
                    d.position.set(parseFloat(data.CV7_X) - offsetX, parseInt(data.CV7_Y) - offsetY, data.CV7_Z);
                    break;
                case "L_FAL":
                    d.position.set(parseFloat(data.L_FAL_X) - offsetX, parseInt(data.L_FAL_Y) - offsetY, data.L_FAL_Z);
                    break;
                case "L_FAX":
                    d.position.set(parseFloat(data.L_FAX_X) - offsetX, parseInt(data.L_FAX_Y) - offsetY, data.L_FAX_Z);
                    break;
                case "L_FCC":
                    d.position.set(parseFloat(data.L_FCC_X) - offsetX, parseInt(data.L_FCC_Y) - offsetY, data.L_FCC_Z);
                    break;
                case "L_FLE":
                    d.position.set(parseFloat(data.L_FLE_X) - offsetX, parseInt(data.L_FLE_Y) - offsetY, data.L_FLE_Z);
                    break;
                case "L_FM1":
                    d.position.set(parseFloat(data.L_FM1_X) - offsetX, parseInt(data.L_FM1_Y) - offsetY, data.L_FM1_Z);
                    break;
                case "L_FM2":
                    d.position.set(parseFloat(data.L_FM2_X) - offsetX, parseInt(data.L_FM2_Y) - offsetY, data.L_FM2_Z);
                    break;
                case "L_FM5":
                    d.position.set(parseFloat(data.L_FM5_X) - offsetX, parseInt(data.L_FM5_Y) - offsetY, data.L_FM5_Z);
                    break;
                case "L_FME":
                    d.position.set(parseFloat(data.L_FME_X) - offsetX, parseInt(data.L_FME_Y) - offsetY, data.L_FME_Z);
                    break;
                case "L_FTC":
                    d.position.set(parseFloat(data.L_FTC_X) - offsetX, parseInt(data.L_FTC_Y) - offsetY, data.L_FTC_Z);
                    break;
                case "L_HLE":
                    d.position.set(parseFloat(data.L_HLE_X) - offsetX, parseInt(data.L_HLE_Y) - offsetY, data.L_HLE_Z);
                    break;
                case "L_HM2":
                    d.position.set(parseFloat(data.L_HM2_X) - offsetX, parseInt(data.L_HM2_Y) - offsetY, data.L_HM2_Z);
                    break;
                case "L_HM5":
                    d.position.set(parseFloat(data.L_HM5_X) - offsetX, parseInt(data.L_HM5_Y) - offsetY, data.L_HM5_Z);
                    break;
                case "L_HME":
                    d.position.set(parseFloat(data.L_HME_X) - offsetX, parseInt(data.L_HME_Y) - offsetY, data.L_HME_Z);
                    break;
                case "L_IAS":
                    d.position.set(parseFloat(data.L_IAS_X) - offsetX, parseInt(data.L_IAS_Y) - offsetY, data.L_IAS_Z);
                    break;
                case "L_IPS":
                    d.position.set(parseFloat(data.L_IPS_X) - offsetX, parseInt(data.L_IPS_Y) - offsetY, data.L_IPS_Z);
                    break;
                case "L_RSP":
                    d.position.set(parseFloat(data.L_RSP_X) - offsetX, parseInt(data.L_RSP_Y) - offsetY, data.L_RSP_Z);
                    break;
                case "L_SAA":
                    d.position.set(parseFloat(data.L_SAA_X) - offsetX, parseInt(data.L_SAA_Y) - offsetY, data.L_SAA_Z);
                    break;
                case "L_SAE":
                    d.position.set(parseFloat(data.L_SAE_X) - offsetX, parseInt(data.L_SAE_Y) - offsetY, data.L_SAE_Z);
                    break;
                case "L_SIA":
                    d.position.set(parseFloat(data.L_SIA_X) - offsetX, parseInt(data.L_SIA_Y) - offsetY, data.L_SIA_Z);
                    break;
                case "L_SRS":
                    d.position.set(parseFloat(data.L_SRS_X) - offsetX, parseInt(data.L_SRS_Y) - offsetY, data.L_SRS_Z);
                    break;
                case "L_TAM":
                    d.position.set(parseFloat(data.L_TAM_X) - offsetX, parseInt(data.L_TAM_Y) - offsetY, data.L_TAM_Z);
                    break;
                case "L_TTC":
                    d.position.set(parseFloat(data.L_TTC_X) - offsetX, parseInt(data.L_TTC_Y) - offsetY, data.L_TTC_Z);
                    break;
                case "L_UHE":
                    d.position.set(parseFloat(data.L_UHE_X) - offsetX, parseInt(data.L_UHE_Y) - offsetY, data.L_UHE_Z);
                    break;
                case "L_UOA":
                    d.position.set(parseFloat(data.L_UOA_X) - offsetX, parseInt(data.L_UOA_Y) - offsetY, data.L_UOA_Z);
                    break;
                case "R_FAL":
                    d.position.set(parseFloat(data.R_FAL_X) - offsetX, parseInt(data.R_FAL_Y) - offsetY, data.R_FAL_Z);
                    break;
                case "R_FAX":
                    d.position.set(parseFloat(data.R_FAX_X) - offsetX, parseInt(data.R_FAX_Y) - offsetY, data.R_FAX_Z);
                    break;
                case "R_FCC":
                    d.position.set(parseFloat(data.R_FCC_X) - offsetX, parseInt(data.R_FCC_Y) - offsetY, data.R_FCC_Z);
                    break;
                case "R_FLE":
                    d.position.set(parseFloat(data.R_FLE_X) - offsetX, parseInt(data.R_FLE_Y) - offsetY, data.R_FLE_Z);
                    break;
                case "R_FM1":
                    d.position.set(parseFloat(data.R_FM1_X) - offsetX, parseInt(data.R_FM1_Y) - offsetY, data.R_FM1_Z);
                    break;
                case "R_FM2":
                    d.position.set(parseFloat(data.R_FM2_X) - offsetX, parseInt(data.R_FM2_Y) - offsetY, data.R_FM2_Z);
                    break;
                case "R_FM5":
                    d.position.set(parseFloat(data.R_FM5_X) - offsetX, parseInt(data.R_FM5_Y) - offsetY, data.R_FM5_Z);
                    break;
                case "R_FME":
                    d.position.set(parseFloat(data.R_FME_X) - offsetX, parseInt(data.R_FME_Y) - offsetY, data.R_FME_Z);
                    break;
                case "R_FTC":
                    d.position.set(parseFloat(data.R_FTC_X) - offsetX, parseInt(data.R_FTC_Y) - offsetY, data.R_FTC_Z);
                    break;
                case "R_HLE":
                    d.position.set(parseFloat(data.R_HLE_X) - offsetX, parseInt(data.R_HLE_Y) - offsetY, data.R_HLE_Z);
                    break;
                case "R_HM2":
                    d.position.set(parseFloat(data.R_HM2_X) - offsetX, parseInt(data.R_HM2_Y) - offsetY, data.R_HM2_Z);
                    break;
                case "R_HM5":
                    d.position.set(parseFloat(data.R_HM5_X) - offsetX, parseInt(data.R_HM5_Y) - offsetY, data.R_HM5_Z);
                    break;
                case "R_HME":
                    d.position.set(parseFloat(data.R_HME_X) - offsetX, parseInt(data.R_HME_Y) - offsetY, data.R_HME_Z);
                    break;
                case "R_IAS":
                    d.position.set(parseFloat(data.R_IAS_X) - offsetX, parseInt(data.R_IAS_Y) - offsetY, data.R_IAS_Z);
                    break;
                case "R_IPS":
                    d.position.set(parseFloat(data.R_IPS_X) - offsetX, parseInt(data.R_IPS_Y) - offsetY, data.R_IPS_Z);
                    break;
                case "R_RSP":
                    d.position.set(parseFloat(data.R_RSP_X) - offsetX, parseInt(data.R_RSP_Y) - offsetY, data.R_RSP_Z);
                    break;
                case "R_SAA":
                    d.position.set(parseFloat(data.R_SAA_X) - offsetX, parseInt(data.R_SAA_Y) - offsetY, data.R_SAA_Z);
                    break;
                case "R_SAE":
                    d.position.set(parseFloat(data.R_SAE_X) - offsetX, parseInt(data.R_SAE_Y) - offsetY, data.R_SAE_Z);
                    break;
                case "R_SIA":
                    d.position.set(parseFloat(data.R_SIA_X) - offsetX, parseInt(data.R_SIA_Y) - offsetY, data.R_SIA_Z);
                    break;
                case "R_SRS":
                    d.position.set(parseFloat(data.R_SRS_X) - offsetX, parseInt(data.R_SRS_Y) - offsetY, data.R_SRS_Z);
                    break;
                case "R_TAM":
                    d.position.set(parseFloat(data.R_TAM_X) - offsetX, parseInt(data.R_TAM_Y) - offsetY, data.R_TAM_Z);
                    break;
                case "R_TTC":
                    d.position.set(parseFloat(data.R_TTC_X) - offsetX, parseInt(data.R_TTC_Y) - offsetY, data.R_TTC_Z);
                    break;
                case "R_UHE":
                    d.position.set(parseFloat(data.R_UHE_X) - offsetX, parseInt(data.R_UHE_Y) - offsetY, data.R_UHE_Z);
                    break;
                case "R_UOA":
                    d.position.set(parseFloat(data.R_UOA_X) - offsetX, parseInt(data.R_UOA_Y) - offsetY, data.R_UOA_Z);
                    break;
                case "SJN":
                    d.position.set(parseFloat(data.SJN_X) - offsetX, parseInt(data.SJN_Y) - offsetY, data.SJN_Z);
                    break;
                case "SXS":
                    d.position.set(parseFloat(data.SXS_X) - offsetX, parseInt(data.SXS_Y) - offsetY, data.SXS_Z);
                    break;
                case "TV10":
                    d.position.set(parseFloat(data.TV10_X) - offsetX, parseInt(data.TV10_Y) - offsetY, data.TV10_Z);
                    break;
                default:
                    ;
            }
        });
    }
}

function loadParticipantsDataToFilter(pList){
    minAge = 100, maxAge = 0, minW = 400, maxW =0, minH = 300, maxH = 0;

    //Subset footsteps data to current participant selection
    filterFootsteps = footsteps_data.filter(function(d,i){
        return participants.indexOf(d.participantID) >= 0
    });

    selectedParticipant = filterMarkers[0];
    selectedParticipantDemo = filterDemo[0];
    selectedParticipantFootsteps = filterFootsteps.filter(function (d) {
        return (selectedParticipantDemo.ID == d.participantID) && (parseFloat(d.speed) == speed) && (parseFloat(d.trial)==trial);
    })[0];

    topViewMaker.createTopView(selectedParticipantFootsteps, selectedParticipant);

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
    document.getElementsByClassName("age-slider-input")[0].setAttribute("value", leftAge);
    document.getElementsByClassName("age-slider-input")[1].setAttribute("value", rightAge);

    sliderLowerHandleController(document.getElementsByClassName("age-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("age-slider-input")[1]);

    document.getElementsByClassName("age-slider-input")[0].addEventListener("click", ageSlider);
    document.getElementsByClassName("age-slider-input")[1].addEventListener("click", ageSlider);

    //Update the Height slider
    document.getElementsByClassName("height-slider-input")[0].setAttribute("step", 1);
    document.getElementsByClassName("height-slider-input")[1].setAttribute("step", 1);
    document.getElementsByClassName("height-slider-input")[0].setAttribute("value", leftHeight );
    document.getElementsByClassName("height-slider-input")[1].setAttribute("value", rightHeight );

    sliderLowerHandleController(document.getElementsByClassName("height-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("height-slider-input")[1]);

    document.getElementsByClassName("height-slider-input")[0].addEventListener("click", heightSlider);
    document.getElementsByClassName("height-slider-input")[1].addEventListener("click", heightSlider);

    //Update the Weight slider
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("value", leftWeight);
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("value", rightWeight );
    document.getElementsByClassName("weight-slider-input")[0].setAttribute("step", 0.5);
    document.getElementsByClassName("weight-slider-input")[1].setAttribute("step", 0.5);

    sliderLowerHandleController(document.getElementsByClassName("weight-slider-input")[0]);
    sliderUpperHandleController(document.getElementsByClassName("weight-slider-input")[1]);

    document.getElementsByClassName("weight-slider-input")[0].addEventListener("click", weightSlider);
    document.getElementsByClassName("weight-slider-input")[1].addEventListener("click", weightSlider);

    //Update data when Filter button is clicked
    document.getElementById("filter-btn").addEventListener("click", localFilterData);
    document.getElementById("filter-btn").addEventListener("click", (ev)=>{
        let gender = -1;
        if(document.getElementById("female-check").checked){
            gender = 0;
        }
        if(document.getElementById("male-check").checked){
            gender = 1;
            if(document.getElementById("female-check").checked){
                gender = -1;
            }
        }
        filterData(-1,-1,-1,-1,-1,-1,gender,-1,-1,[])
            .then(()=>{
                minAge = 100;
                maxAge = 0
                for (let i = 0; i<filterDemo.length; i++){
                    //Age
                    if(parseInt(filterDemo[i].Age) < minAge)
                        minAge = parseInt(filterDemo[i].Age);
                    if(parseInt(filterDemo[i].Age) > maxAge)
                        maxAge = parseInt(filterDemo[i].Age);
                }
                leftAge = minAge, rightAge = maxAge;
                document.getElementsByClassName("age-slider-input")[0].setAttribute("value", leftAge); // minAge +5
                document.getElementsByClassName("age-slider-input")[1].setAttribute("value", rightAge); // maxAge -5

                sliderLowerHandleController(document.getElementsByClassName("age-slider-input")[0]);
                sliderUpperHandleController(document.getElementsByClassName("age-slider-input")[1]);
            })
    });

    //Load participant IDs to current selectors
    // for(let i = 0; i< pList.length; i++) {
    //     document.querySelector("#participant-list").innerHTML += "\n<option value=\"" + pList[i] + "\">" + pList[i] + "</option>";
    // }
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
        var gender;
        if (participant.Gender == 0)
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

//================================================================================
//Screenshot handlers
export function save3DSceneView(dateString) {
    var screenshotData;

    try {
        screenshotData = renderer.domElement.toDataURL("image/png");
        downloadFile(screenshotData.replace("image/png",  "image/octet-stream"), "3DView_"+dateString+ ".png");

    } catch (err) {
        console.log(err);
        return;
    }

}

var downloadFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}

//================================================================================
//Updating
export function updateSpeed(newSpeed){
    speed = newSpeed;
}

export function updateTrial(newTrial){
    trial = newTrial;
}

export function updateScene(){
    scene.children.forEach(function (d){
        if(typeof d.userData.id !== 'undefined')
            scene.remove(d);
    });

    load3DView();

    //Hard-coded, need to be fixed
    scene.remove(scene.children[1]);
}

export function clearFilterDemo(){
    filterDemo = [];
}

export function clearFilterMarkers() {
    filterMarkers = [];
}