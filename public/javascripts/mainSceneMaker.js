// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2)/ (window.innerHeight*0.9) , 0.1, 1000 );

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

//const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 5;

function onWindowResize() {
    camera.aspect = (window.innerWidth/2) /(window.innerHeight*0.9);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth/2),window.innerHeight*0.9);
}

window.addEventListener('resize', onWindowResize)

const animate = function () {
    requestAnimationFrame( animate );

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();

let markers_data = [];
let demo_data = [];
let markerByParticipant, p1s1t1Data;

async function loadData(){
    var markers_file = "./data/markers.csv";
    var demo_file = "./data/markers.csv";

    await  d3.csv(markers_file, function(d) {
        markers_data.push(d);
    });
    await  d3.csv(demo_file, function(d) {
        demo_data.push(d);
    });
    markerByParticipant = d3.group(markers_data, d => d.Participant, d=>d.Speed, d=>d.Trial);
    //First participant only
    var iterator = markerByParticipant.keys();
    var p1ID = iterator.next().value;

    p1s1t1Data = markerByParticipant.get(p1ID).get("1").get("1");

    drawHumanDots(p1s1t1Data[0])

    console.log(p1s1t1Data[0]);

    console.log(scene)


}

function drawPoint(geometry, x,y,z,pid){
    let meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.color.setHex(0x000000);
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z =z;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;

    //If needed to add later data to points
    mesh.userData = {id: pid};
    return mesh;
}

function drawHumanDots(data){
    //dot geometry
    let geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 0.01);
    let participant = new THREE.Group();

    participant.add(drawPoint(geometry,data.CV7_X, data.CV7_Y, data.CV7_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FAL_X, data.L_FAL_Y, data.L_FAL_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FAX_X, data.L_FAX_Y, data.L_FAX_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FCC_X, data.L_FCC_Y, data.L_FCC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FLE_X, data.L_FLE_Y, data.L_FLE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FM1_X, data.L_FM1_Y, data.L_FM1_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FM2_X, data.L_FM2_Y, data.L_FM2_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FM5_X, data.L_FM5_Y, data.L_FM5_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FME_X, data.L_FME_Y, data.L_FME_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_FTC_X, data.L_FTC_Y, data.L_FTC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_HLE_X, data.L_HLE_Y, data.L_HLE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_HM2_X, data.L_HM2_Y, data.L_HM2_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_HM5_X, data.L_HM5_Y, data.L_HM5_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_HME_X, data.L_HME_Y, data.L_HME_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_IAS_X, data.L_IAS_Y, data.L_IAS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_IPS_X, data.L_IPS_Y, data.L_IPS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_RSP_X, data.L_RSP_Y, data.L_RSP_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_SAA_X, data.L_SAA_Y, data.L_SAA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_SAE_X, data.L_SAE_Y, data.L_SAE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_SIA_X, data.L_SIA_Y, data.L_SIA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_SRS_X, data.L_SRS_Y, data.L_SRS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_TAM_X, data.L_TAM_Y, data.L_TAM_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_TTC_X, data.L_TTC_Y, data.L_TTC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_UHE_X, data.L_UHE_Y, data.L_UHE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.L_UOA_X, data.L_UOA_Y, data.L_UOA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FAL_X, data.R_FAL_Y, data.R_FAL_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FAX_X, data.R_FAX_Y, data.R_FAX_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FCC_X, data.R_FCC_Y, data.R_FCC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FLE_X, data.R_FLE_Y, data.R_FLE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FM1_X, data.R_FM1_Y, data.R_FM1_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FM2_X, data.R_FM2_Y, data.R_FM2_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FM5_X, data.R_FM5_Y, data.R_FM5_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FME_X, data.R_FME_Y, data.R_FME_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_FTC_X, data.R_FTC_Y, data.R_FTC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_HLE_X, data.R_HLE_Y, data.R_HLE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_HM2_X, data.R_HM2_Y, data.R_HM2_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_HM5_X, data.R_HM5_Y, data.R_HM5_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_HME_X, data.R_HME_Y, data.R_HME_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_IAS_X, data.R_IAS_Y, data.R_IAS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_IPS_X, data.R_IPS_Y, data.R_IPS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_RSP_X, data.R_RSP_Y, data.R_RSP_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_SAA_X, data.R_SAA_Y, data.R_SAA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_SAE_X, data.R_SAE_Y, data.R_SAE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_SIA_X, data.R_SIA_Y, data.R_SIA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_SRS_X, data.R_SRS_Y, data.R_SRS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_TAM_X, data.R_TAM_Y, data.R_TAM_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_TTC_X, data.R_TTC_Y, data.R_TTC_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_UHE_X, data.R_UHE_Y, data.R_UHE_Z, data.Participant));
    participant.add(drawPoint(geometry,data.R_UOA_X, data.R_UOA_Y, data.R_UOA_Z, data.Participant));
    participant.add(drawPoint(geometry,data.SJN_X, data.SJN_Y, data.SJN_Z, data.Participant));
    participant.add(drawPoint(geometry,data.SXS_X, data.SXS_Y, data.SXS_Z, data.Participant));
    participant.add(drawPoint(geometry,data.TV10_X, data.TV10_Y, data.TV10_Z, data.Participant));

    scene.add(participant);
    console.log("done adding participant");
}
loadData();