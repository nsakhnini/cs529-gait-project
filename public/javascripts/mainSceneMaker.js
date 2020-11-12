// Find the latest version by visiting https://unpkg.com/three. The URL will
// redirect to the newest stable release.
import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

let markers_data = [];
let demo_data = [];
let markerByParticipant, p1s1t1Data, participant, timestamp = 0;

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


function onWindowResize() {
    camera.aspect = (window.innerWidth/2) /(window.innerHeight*0.9);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth/2),window.innerHeight*0.9);
}

window.addEventListener('resize', onWindowResize)

const animate = function () {
    requestAnimationFrame( animate );

    if (timestamp >= p1s1t1Data.length){
        timestamp = 0;
    }
    else{
        timestamp += 1;
    }
    move(p1s1t1Data[timestamp], participant);

    renderer.render( scene, camera );
};


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

    camera.position.x =-1400;
    camera.position.y = 0;
    camera.position.z =0;

    camera.lookAt(parseInt(p1s1t1Data[0].CV7_X),parseInt(p1s1t1Data[0].CV7_Y),parseInt(p1s1t1Data[0].CV7_Z));



    console.log(camera);

    console.log(scene)

    animate();

}

function drawPoint(geometry, x,y,z,pid, joint){
    let meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.color.setHex(0xeb3434);
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.x = x;
    mesh.position.y = z;
    mesh.position.z =y;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 500;

    //If needed to add later data to points
    mesh.userData = {id: pid, joint: joint};
    return mesh;
}

function drawHumanDots(data){
    //dot geometry
    let geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 0.01);
    participant = new THREE.Group();

    participant.add(drawPoint(geometry,data.CV7_X, data.CV7_Y, data.CV7_Z, data.Participant, "CV7"));
    participant.add(drawPoint(geometry,data.L_FAL_X, data.L_FAL_Y, data.L_FAL_Z, data.Participant, "L_FAL"));
    participant.add(drawPoint(geometry,data.L_FAX_X, data.L_FAX_Y, data.L_FAX_Z, data.Participant, "L_FAX"));
    participant.add(drawPoint(geometry,data.L_FCC_X, data.L_FCC_Y, data.L_FCC_Z, data.Participant, "L_FCC"));
    participant.add(drawPoint(geometry,data.L_FLE_X, data.L_FLE_Y, data.L_FLE_Z, data.Participant, "L_FLE"));
    participant.add(drawPoint(geometry,data.L_FM1_X, data.L_FM1_Y, data.L_FM1_Z, data.Participant, "L_FM1"));
    participant.add(drawPoint(geometry,data.L_FM2_X, data.L_FM2_Y, data.L_FM2_Z, data.Participant, "L_FM2"));
    participant.add(drawPoint(geometry,data.L_FM5_X, data.L_FM5_Y, data.L_FM5_Z, data.Participant, "L_FM5"));
    participant.add(drawPoint(geometry,data.L_FME_X, data.L_FME_Y, data.L_FME_Z, data.Participant, "L_FME"));
    participant.add(drawPoint(geometry,data.L_FTC_X, data.L_FTC_Y, data.L_FTC_Z, data.Participant, "L_FTC"));
    participant.add(drawPoint(geometry,data.L_HLE_X, data.L_HLE_Y, data.L_HLE_Z, data.Participant, "L_HLE"));
    participant.add(drawPoint(geometry,data.L_HM2_X, data.L_HM2_Y, data.L_HM2_Z, data.Participant, "L_HM2"));
    participant.add(drawPoint(geometry,data.L_HM5_X, data.L_HM5_Y, data.L_HM5_Z, data.Participant, "L_HM5"));
    participant.add(drawPoint(geometry,data.L_HME_X, data.L_HME_Y, data.L_HME_Z, data.Participant, "L_HME"));
    participant.add(drawPoint(geometry,data.L_IAS_X, data.L_IAS_Y, data.L_IAS_Z, data.Participant, "L_IAS"));
    participant.add(drawPoint(geometry,data.L_IPS_X, data.L_IPS_Y, data.L_IPS_Z, data.Participant, "L_IPS"));
    participant.add(drawPoint(geometry,data.L_RSP_X, data.L_RSP_Y, data.L_RSP_Z, data.Participant, "L_RSP"));
    participant.add(drawPoint(geometry,data.L_SAA_X, data.L_SAA_Y, data.L_SAA_Z, data.Participant, "L_SAA"));
    participant.add(drawPoint(geometry,data.L_SAE_X, data.L_SAE_Y, data.L_SAE_Z, data.Participant, "L_SAE"));
    participant.add(drawPoint(geometry,data.L_SIA_X, data.L_SIA_Y, data.L_SIA_Z, data.Participant, "L_SIA"));
    participant.add(drawPoint(geometry,data.L_SRS_X, data.L_SRS_Y, data.L_SRS_Z, data.Participant, "L_SRS"));
    participant.add(drawPoint(geometry,data.L_TAM_X, data.L_TAM_Y, data.L_TAM_Z, data.Participant, "L_TAM"));
    participant.add(drawPoint(geometry,data.L_TTC_X, data.L_TTC_Y, data.L_TTC_Z, data.Participant, "L_TTC"));
    participant.add(drawPoint(geometry,data.L_UHE_X, data.L_UHE_Y, data.L_UHE_Z, data.Participant, "L_UHE"));
    participant.add(drawPoint(geometry,data.L_UOA_X, data.L_UOA_Y, data.L_UOA_Z, data.Participant, "L_UOA"));
    participant.add(drawPoint(geometry,data.R_FAL_X, data.R_FAL_Y, data.R_FAL_Z, data.Participant, "R_FAL"));
    participant.add(drawPoint(geometry,data.R_FAX_X, data.R_FAX_Y, data.R_FAX_Z, data.Participant, "R_FAX"));
    participant.add(drawPoint(geometry,data.R_FCC_X, data.R_FCC_Y, data.R_FCC_Z, data.Participant, "R_FCC"));
    participant.add(drawPoint(geometry,data.R_FLE_X, data.R_FLE_Y, data.R_FLE_Z, data.Participant, "R_FLE"));
    participant.add(drawPoint(geometry,data.R_FM1_X, data.R_FM1_Y, data.R_FM1_Z, data.Participant, "R_FM1"));
    participant.add(drawPoint(geometry,data.R_FM2_X, data.R_FM2_Y, data.R_FM2_Z, data.Participant, "R_FM2"));
    participant.add(drawPoint(geometry,data.R_FM5_X, data.R_FM5_Y, data.R_FM5_Z, data.Participant, "R_FM5"));
    participant.add(drawPoint(geometry,data.R_FME_X, data.R_FME_Y, data.R_FME_Z, data.Participant, "R_FME"));
    participant.add(drawPoint(geometry,data.R_FTC_X, data.R_FTC_Y, data.R_FTC_Z, data.Participant, "R_FTC"));
    participant.add(drawPoint(geometry,data.R_HLE_X, data.R_HLE_Y, data.R_HLE_Z, data.Participant, "R_HLE"));
    participant.add(drawPoint(geometry,data.R_HM2_X, data.R_HM2_Y, data.R_HM2_Z, data.Participant, "R_HM2"));
    participant.add(drawPoint(geometry,data.R_HM5_X, data.R_HM5_Y, data.R_HM5_Z, data.Participant, "R_HM5"));
    participant.add(drawPoint(geometry,data.R_HME_X, data.R_HME_Y, data.R_HME_Z, data.Participant, "R_HME"));
    participant.add(drawPoint(geometry,data.R_IAS_X, data.R_IAS_Y, data.R_IAS_Z, data.Participant, "R_IAS"));
    participant.add(drawPoint(geometry,data.R_IPS_X, data.R_IPS_Y, data.R_IPS_Z, data.Participant, "R_IPS"));
    participant.add(drawPoint(geometry,data.R_RSP_X, data.R_RSP_Y, data.R_RSP_Z, data.Participant, "R_RSP"));
    participant.add(drawPoint(geometry,data.R_SAA_X, data.R_SAA_Y, data.R_SAA_Z, data.Participant, "R_SAA"));
    participant.add(drawPoint(geometry,data.R_SAE_X, data.R_SAE_Y, data.R_SAE_Z, data.Participant, "R_SAE"));
    participant.add(drawPoint(geometry,data.R_SIA_X, data.R_SIA_Y, data.R_SIA_Z, data.Participant, "R_SIA"));
    participant.add(drawPoint(geometry,data.R_SRS_X, data.R_SRS_Y, data.R_SRS_Z, data.Participant, "R_SRS"));
    participant.add(drawPoint(geometry,data.R_TAM_X, data.R_TAM_Y, data.R_TAM_Z, data.Participant, "R_TAM"));
    participant.add(drawPoint(geometry,data.R_TTC_X, data.R_TTC_Y, data.R_TTC_Z, data.Participant, "R_TTC"));
    participant.add(drawPoint(geometry,data.R_UHE_X, data.R_UHE_Y, data.R_UHE_Z, data.Participant, "R_UHE"));
    participant.add(drawPoint(geometry,data.R_UOA_X, data.R_UOA_Y, data.R_UOA_Z, data.Participant, "R_UOA"));
    participant.add(drawPoint(geometry,data.SJN_X, data.SJN_Y, data.SJN_Z, data.Participant, "SJN"));
    participant.add(drawPoint(geometry,data.SXS_X, data.SXS_Y, data.SXS_Z, data.Participant, "SXS"));
    participant.add(drawPoint(geometry,data.TV10_X, data.TV10_Y, data.TV10_Z, data.Participant, "TV10"));

    scene.add(participant);
    console.log("done adding participant");
}

function move(data, person){
    if (typeof data !== 'undefined'){
        person.children.forEach(function (d) {
            let joint = d.userData.joint;
            switch (joint) {
                case "CV7":
                    d.position.set(data.CV7_X, data.CV7_Y, data.CV7_Z);
                    break;
                case "L_FAL":
                    d.position.set(data.L_FAL_X, data.L_FAL_Y, data.L_FAL_Z);
                    break;
                case "L_FAX":
                    d.position.set(data.L_FAX_X, data.L_FAX_Y, data.L_FAX_Z);
                    break;
                case "L_FCC":
                    d.position.set(data.L_FCC_X, data.L_FCC_Y, data.L_FCC_Z);
                    break;
                case "L_FLE":
                    d.position.set(data.L_FLE_X, data.L_FLE_Y, data.L_FLE_Z);
                    break;
                case "L_FM1":
                    d.position.set(data.L_FM1_X, data.L_FM1_Y, data.L_FM1_Z);
                    break;
                case "L_FM2":
                    d.position.set(data.L_FM2_X, data.L_FM2_Y, data.L_FM2_Z);
                    break;
                case "L_FM5":
                    d.position.set(data.L_FM5_X, data.L_FM5_Y, data.L_FM5_Z);
                    break;
                case "L_FME":
                    d.position.set(data.L_FME_X, data.L_FME_Y, data.L_FME_Z);
                    break;
                case "L_FTC":
                    d.position.set(data.L_FTC_X, data.L_FTC_Y, data.L_FTC_Z);
                    break;
                case "L_HLE":
                    d.position.set(data.L_HLE_X, data.L_HLE_Y, data.L_HLE_Z);
                    break;
                case "L_HM2":
                    d.position.set(data.L_HM2_X, data.L_HM2_Y, data.L_HM2_Z);
                    break;
                case "L_HM5":
                    d.position.set(data.L_HM5_X, data.L_HM5_Y, data.L_HM5_Z);
                    break;
                case "L_HME":
                    d.position.set(data.L_HME_X, data.L_HME_Y, data.L_HME_Z);
                    break;
                case "L_IAS":
                    d.position.set(data.L_IAS_X, data.L_IAS_Y, data.L_IAS_Z);
                    break;
                case "L_IPS":
                    d.position.set(data.L_IPS_X, data.L_IPS_Y, data.L_IPS_Z);
                    break;
                case "L_RSP":
                    d.position.set(data.L_RSP_X, data.L_RSP_Y, data.L_RSP_Z);
                    break;
                case "L_SAA":
                    d.position.set(data.L_SAA_X, data.L_SAA_Y, data.L_SAA_Z);
                    break;
                case "L_SAE":
                    d.position.set(data.L_SAE_X, data.L_SAE_Y, data.L_SAE_Z);
                    break;
                case "L_SIA":
                    d.position.set(data.L_SIA_X, data.L_SIA_Y, data.L_SIA_Z);
                    break;
                case "L_SRS":
                    d.position.set(data.L_SRS_X, data.L_SRS_Y, data.L_SRS_Z);
                    break;
                case "L_TAM":
                    d.position.set(data.L_TAM_X, data.L_TAM_Y, data.L_TAM_Z);
                    break;
                case "L_TTC":
                    d.position.set(data.L_TTC_X, data.L_TTC_Y, data.L_TTC_Z);
                    break;
                case "L_UHE":
                    d.position.set(data.L_UHE_X, data.L_UHE_Y, data.L_UHE_Z);
                    break;
                case "L_UOA":
                    d.position.set(data.L_UOA_X, data.L_UOA_Y, data.L_UOA_Z);
                    break;
                case "R_FAL":
                    d.position.set(data.R_FAL_X, data.R_FAL_Y, data.R_FAL_Z);
                    break;
                case "R_FAX":
                    d.position.set(data.R_FAX_X, data.R_FAX_Y, data.R_FAX_Z);
                    break;
                case "R_FCC":
                    d.position.set(data.R_FCC_X, data.R_FCC_Y, data.R_FCC_Z);
                    break;
                case "R_FLE":
                    d.position.set(data.R_FLE_X, data.R_FLE_Y, data.R_FLE_Z);
                    break;
                case "R_FM1":
                    d.position.set(data.R_FM1_X, data.R_FM1_Y, data.R_FM1_Z);
                    break;
                case "R_FM2":
                    d.position.set(data.R_FM2_X, data.R_FM2_Y, data.R_FM2_Z);
                    break;
                case "R_FM5":
                    d.position.set(data.R_FM5_X, data.R_FM5_Y, data.R_FM5_Z);
                    break;
                case "R_FME":
                    d.position.set(data.R_FME_X, data.R_FME_Y, data.R_FME_Z);
                    break;
                case "R_FTC":
                    d.position.set(data.R_FTC_X, data.R_FTC_Y, data.R_FTC_Z);
                    break;
                case "R_HLE":
                    d.position.set(data.R_HLE_X, data.R_HLE_Y, data.R_HLE_Z);
                    break;
                case "R_HM2":
                    d.position.set(data.R_HM2_X, data.R_HM2_Y, data.R_HM2_Z);
                    break;
                case "R_HM5":
                    d.position.set(data.R_HM5_X, data.R_HM5_Y, data.R_HM5_Z);
                    break;
                case "R_HME":
                    d.position.set(data.R_HME_X, data.R_HME_Y, data.R_HME_Z);
                    break;
                case "R_IAS":
                    d.position.set(data.R_IAS_X, data.R_IAS_Y, data.R_IAS_Z);
                    break;
                case "R_IPS":
                    d.position.set(data.R_IPS_X, data.R_IPS_Y, data.R_IPS_Z);
                    break;
                case "R_RSP":
                    d.position.set(data.R_RSP_X, data.R_RSP_Y, data.R_RSP_Z);
                    break;
                case "R_SAA":
                    d.position.set(data.R_SAA_X, data.R_SAA_Y, data.R_SAA_Z);
                    break;
                case "R_SAE":
                    d.position.set(data.R_SAE_X, data.R_SAE_Y, data.R_SAE_Z);
                    break;
                case "R_SIA":
                    d.position.set(data.R_SIA_X, data.R_SIA_Y, data.R_SIA_Z);
                    break;
                case "R_SRS":
                    d.position.set(data.R_SRS_X, data.R_SRS_Y, data.R_SRS_Z);
                    break;
                case "R_TAM":
                    d.position.set(data.R_TAM_X, data.R_TAM_Y, data.R_TAM_Z);
                    break;
                case "R_TTC":
                    d.position.set(data.R_TTC_X, data.R_TTC_Y, data.R_TTC_Z);
                    break;
                case "R_UHE":
                    d.position.set(data.R_UHE_X, data.R_UHE_Y, data.R_UHE_Z);
                    break;
                case "R_UOA":
                    d.position.set(data.R_UOA_X, data.R_UOA_Y, data.R_UOA_Z);
                    break;
                case "SJN":
                    d.position.set(data.SJN_X, data.SJN_Y, data.SJN_Z);
                    break;
                case "SXS":
                    d.position.set(data.SXS_X, data.SXS_Y, data.SXS_Z);
                    break;
                case "TV10":
                    d.position.set(data.TV10_X, data.TV10_Y, data.TV10_Z);
                    break;
                default:
                    ;
            }
        });
    }
}

loadData();