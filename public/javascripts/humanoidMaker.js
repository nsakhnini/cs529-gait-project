import {participantsDirection} from "./mainSceneMaker.js";

let participant, points = [];
let humanoid, back, hips,
    leftUpperArm, leftLowerArm, leftFinger2, leftFinger5, leftShoulder,
    rightUpperArm, rightLowerArm, rightFinger5, rightFinger2, rightShoulder,
    leftUpperLeg, leftLowerLeg, leftToe1, leftToe2, leftToe5,
    rightUpperLeg, rightLowerLeg, rightToe1, rightToe2, rightToe5, midHip;
let edgeGeometry, edge, updatedVector, direction, pDirection;

const factor = new THREE.Matrix4();

factor.set(1,0,0,0,
    0,0,1,0,
    0,-1,0,0,
    0,0,0,1);

const edgeMaterial =  new THREE.MeshBasicMaterial( { color: 0xD138BF } );
const upVector = new THREE.Object3D().up;
const orientation = new THREE.Matrix4();

var createCylinder = function( pointX, pointY) {
    direction = new THREE.Vector3().subVectors( pointY, pointX );
    orientation.lookAt(pointX, pointY, upVector);
    orientation.multiply(factor);

    // radius top, radius bottom, height, radius segments, height segments
    edgeGeometry = new THREE.CylinderGeometry( 10, 10, direction.length(), 4, 1 );

    edge = new THREE.Mesh( edgeGeometry, edgeMaterial)
    edge.applyMatrix4(orientation);

    updatedVector = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5));
    edge.position.x = updatedVector.x;
    edge.position.y = updatedVector.y;
    edge.position.z = updatedVector.z;

    return edge;
}
var humanoidOffsetX, humanoidOffsetY, humanoidOffsetZ;
export function createHumanoid(humanData, offset, demo_data, scene){
    //dot geometry
    let geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 0.01);
    participant = new THREE.Group();
    points = [];
    let myOffest = offset;
    offset = 0;

    if(parseFloat(humanData.L_FCC_Z) >= parseFloat(humanData.R_FCC_Z)){
        humanoidOffsetX = parseFloat(humanData.R_FCC_X);
        humanoidOffsetY = parseFloat(humanData.R_FCC_Y);
        humanoidOffsetZ = parseFloat(humanData.R_FCC_Z);
    }
    else{
        humanoidOffsetX = parseFloat(humanData.L_FCC_X);
        humanoidOffsetY = parseFloat(humanData.L_FCC_Y);
        humanoidOffsetZ = parseFloat(humanData.L_FCC_Z);
    }

    pDirection = participantsDirection.filter(function (w) {
        return w.id == humanData.Participant;
    });

    participant.add(drawPoint(geometry, parseFloat(humanData.CV7_X) - humanoidOffsetX, parseInt(humanData.CV7_Y) + offset - humanoidOffsetY, parseFloat(humanData.CV7_Z) - humanoidOffsetZ,humanData.Participant, "CV7"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FAL_X) - humanoidOffsetX, parseInt(humanData.L_FAL_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FAL_Z) - humanoidOffsetZ,humanData.Participant, "L_FAL"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FAX_X) - humanoidOffsetX, parseInt(humanData.L_FAX_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FAX_Z) - humanoidOffsetZ,humanData.Participant, "L_FAX"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FCC_X) - humanoidOffsetX, parseInt(humanData.L_FCC_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ,humanData.Participant, "L_FCC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FLE_X) - humanoidOffsetX, parseInt(humanData.L_FLE_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FLE_Z) - humanoidOffsetZ,humanData.Participant, "L_FLE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FM1_X) - humanoidOffsetX, parseInt(humanData.L_FM1_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FM1_Z) - humanoidOffsetZ,humanData.Participant, "L_FM1"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FM2_X) - humanoidOffsetX, parseInt(humanData.L_FM2_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FM2_Z) - humanoidOffsetZ,humanData.Participant, "L_FM2"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FM5_X) - humanoidOffsetX, parseInt(humanData.L_FM5_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FM5_Z) - humanoidOffsetZ,humanData.Participant, "L_FM5"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FME_X) - humanoidOffsetX, parseInt(humanData.L_FME_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FME_Z) - humanoidOffsetZ,humanData.Participant, "L_FME"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_FTC_X) - humanoidOffsetX, parseInt(humanData.L_FTC_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ,humanData.Participant, "L_FTC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_HLE_X) - humanoidOffsetX, parseInt(humanData.L_HLE_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_HLE_Z) - humanoidOffsetZ,humanData.Participant, "L_HLE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_HM2_X) - humanoidOffsetX, parseInt(humanData.L_HM2_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_HM2_Z) - humanoidOffsetZ,humanData.Participant, "L_HM2"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_HM5_X) - humanoidOffsetX, parseInt(humanData.L_HM5_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_HM5_Z) - humanoidOffsetZ,humanData.Participant, "L_HM5"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_HME_X) - humanoidOffsetX, parseInt(humanData.L_HME_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_HME_Z) - humanoidOffsetZ,humanData.Participant, "L_HME"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_IAS_X) - humanoidOffsetX, parseInt(humanData.L_IAS_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_IAS_Z) - humanoidOffsetZ,humanData.Participant, "L_IAS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_IPS_X) - humanoidOffsetX, parseInt(humanData.L_IPS_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_IPS_Z) - humanoidOffsetZ,humanData.Participant, "L_IPS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_RSP_X) - humanoidOffsetX, parseInt(humanData.L_RSP_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ,humanData.Participant, "L_RSP"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_SAA_X) - humanoidOffsetX, parseInt(humanData.L_SAA_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_SAA_Z) - humanoidOffsetZ,humanData.Participant, "L_SAA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_SAE_X) - humanoidOffsetX, parseInt(humanData.L_SAE_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_SAE_Z) - humanoidOffsetZ,humanData.Participant, "L_SAE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_SIA_X) - humanoidOffsetX, parseInt(humanData.L_SIA_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_SIA_Z) - humanoidOffsetZ,humanData.Participant, "L_SIA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_SRS_X) - humanoidOffsetX, parseInt(humanData.L_SRS_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_SRS_Z) - humanoidOffsetZ,humanData.Participant, "L_SRS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_TAM_X) - humanoidOffsetX, parseInt(humanData.L_TAM_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_TAM_Z) - humanoidOffsetZ,humanData.Participant, "L_TAM"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_TTC_X) - humanoidOffsetX, parseInt(humanData.L_TTC_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_TTC_Z) - humanoidOffsetZ,humanData.Participant, "L_TTC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_UHE_X) - humanoidOffsetX, parseInt(humanData.L_UHE_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_UHE_Z) - humanoidOffsetZ,humanData.Participant, "L_UHE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.L_UOA_X) - humanoidOffsetX, parseInt(humanData.L_UOA_Y) + offset - humanoidOffsetY, parseFloat(humanData.L_UOA_Z) - humanoidOffsetZ,humanData.Participant, "L_UOA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FAL_X) - humanoidOffsetX, parseInt(humanData.R_FAL_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FAL_Z) - humanoidOffsetZ,humanData.Participant, "R_FAL"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FAX_X) - humanoidOffsetX, parseInt(humanData.R_FAX_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FAX_Z) - humanoidOffsetZ,humanData.Participant, "R_FAX"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FCC_X) - humanoidOffsetX, parseInt(humanData.R_FCC_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ,humanData.Participant, "R_FCC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FLE_X) - humanoidOffsetX, parseInt(humanData.R_FLE_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FLE_Z) - humanoidOffsetZ,humanData.Participant, "R_FLE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FM1_X) - humanoidOffsetX, parseInt(humanData.R_FM1_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FM1_Z) - humanoidOffsetZ,humanData.Participant, "R_FM1"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FM2_X) - humanoidOffsetX, parseInt(humanData.R_FM2_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FM2_Z) - humanoidOffsetZ,humanData.Participant, "R_FM2"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FM5_X) - humanoidOffsetX, parseInt(humanData.R_FM5_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FM5_Z) - humanoidOffsetZ,humanData.Participant, "R_FM5"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FME_X) - humanoidOffsetX, parseInt(humanData.R_FME_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FME_Z) - humanoidOffsetZ,humanData.Participant, "R_FME"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_FTC_X) - humanoidOffsetX, parseInt(humanData.R_FTC_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ,humanData.Participant, "R_FTC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_HLE_X) - humanoidOffsetX, parseInt(humanData.R_HLE_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_HLE_Z) - humanoidOffsetZ,humanData.Participant, "R_HLE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_HM2_X) - humanoidOffsetX, parseInt(humanData.R_HM2_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_HM2_Z) - humanoidOffsetZ,humanData.Participant, "R_HM2"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_HM5_X) - humanoidOffsetX, parseInt(humanData.R_HM5_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_HM5_Z) - humanoidOffsetZ,humanData.Participant, "R_HM5"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_HME_X) - humanoidOffsetX, parseInt(humanData.R_HME_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_HME_Z) - humanoidOffsetZ,humanData.Participant, "R_HME"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_IAS_X) - humanoidOffsetX, parseInt(humanData.R_IAS_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_IAS_Z) - humanoidOffsetZ,humanData.Participant, "R_IAS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_IPS_X) - humanoidOffsetX, parseInt(humanData.R_IPS_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_IPS_Z) - humanoidOffsetZ,humanData.Participant, "R_IPS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_RSP_X) - humanoidOffsetX, parseInt(humanData.R_RSP_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ,humanData.Participant, "R_RSP"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_SAA_X) - humanoidOffsetX, parseInt(humanData.R_SAA_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_SAA_Z) - humanoidOffsetZ,humanData.Participant, "R_SAA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_SAE_X) - humanoidOffsetX, parseInt(humanData.R_SAE_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_SAE_Z) - humanoidOffsetZ,humanData.Participant, "R_SAE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_SIA_X) - humanoidOffsetX, parseInt(humanData.R_SIA_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_SIA_Z) - humanoidOffsetZ,humanData.Participant, "R_SIA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_SRS_X) - humanoidOffsetX, parseInt(humanData.R_SRS_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_SRS_Z) - humanoidOffsetZ,humanData.Participant, "R_SRS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_TAM_X) - humanoidOffsetX, parseInt(humanData.R_TAM_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_TAM_Z) - humanoidOffsetZ,humanData.Participant, "R_TAM"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_TTC_X) - humanoidOffsetX, parseInt(humanData.R_TTC_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_TTC_Z) - humanoidOffsetZ,humanData.Participant, "R_TTC"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_UHE_X) - humanoidOffsetX, parseInt(humanData.R_UHE_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_UHE_Z) - humanoidOffsetZ,humanData.Participant, "R_UHE"));
    participant.add(drawPoint(geometry, parseFloat(humanData.R_UOA_X) - humanoidOffsetX, parseInt(humanData.R_UOA_Y) + offset - humanoidOffsetY, parseFloat(humanData.R_UOA_Z) - humanoidOffsetZ,humanData.Participant, "R_UOA"));
    participant.add(drawPoint(geometry, parseFloat(humanData.SJN_X) - humanoidOffsetX, parseInt(humanData.SJN_Y) + offset - humanoidOffsetY, parseFloat(humanData.SJN_Z) - humanoidOffsetZ,humanData.Participant, "SJN"));
    participant.add(drawPoint(geometry, parseFloat(humanData.SXS_X) - humanoidOffsetX, parseInt(humanData.SXS_Y) + offset - humanoidOffsetY, parseFloat(humanData.SXS_Z) - humanoidOffsetZ,humanData.Participant, "SXS"));
    participant.add(drawPoint(geometry, parseFloat(humanData.TV10_X) - humanoidOffsetX, parseInt(humanData.TV10_Y) + offset - humanoidOffsetY, parseFloat(humanData.TV10_Z) - humanoidOffsetZ,humanData.Participant, "TV10"));

    participant.userData = {id: humanData.Participant,
        offset: myOffest,
        gender: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Gender,
        age: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Age,
        weight: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Weight,
        height: demo_data.filter(function(d){return humanData.Participant == d.ID})[0].Height};


    drawHumanoid(humanData,offset, participant);
    participant.position.x = 0;
    participant.position.y = myOffest;
    participant.position.z = 0;

    scene.add(participant);
    console.log("done adding participant");
}

function drawPoint(geometry, x,y,z,pid, joint){
    let meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.color.setHex(0x5CF64A);
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.x = x;
    mesh.position.y = z;
    mesh.position.z =y;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1500;

    points.push( new THREE.Vector3( x, y, z ));
    //points.push({ id: pid, name: joint, vector: new THREE.Vector3( x, y, z ) });
    //If needed to add later data to points
    mesh.userData = {id: pid, joint: joint};
    return mesh;
}
let partsArray;

export function drawHumanoid(humanData , offset, participant){

    //TODO: Update current humanoid instead of creating new one, current setting is breaking the memory

    humanoid = new THREE.Group();

    //Handling 1 participant with no CV7 point data
    if(isNaN(parseFloat(humanData.CV7_X))){
        humanData.CV7_X = (parseFloat(humanData.R_SAE_X) + parseFloat(humanData.L_SAE_X))/2;
        humanData.CV7_Y = (parseFloat(humanData.R_SAE_Y) + parseFloat(humanData.L_SAE_Y))/2;
        humanData.CV7_Z = (parseFloat(humanData.R_SAE_Z) + parseFloat(humanData.L_SAE_Z))/2;
    }

    hips = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FTC_X) - humanoidOffsetX , parseFloat(humanData.L_FTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.R_FTC_X) - humanoidOffsetX , parseFloat(humanData.R_FTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ ));

    midHip = new THREE.Vector3(((parseFloat(humanData.L_FTC_X) - humanoidOffsetX  + parseFloat(humanData.R_FTC_X) - humanoidOffsetX )/2) ,
        ((parseFloat(humanData.L_FTC_Y) - humanoidOffsetY  + parseFloat(humanData.R_FTC_Y) - humanoidOffsetY )/2) + offset ,
        ((parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ  + parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ )/2));

    back = createCylinder(new THREE.Vector3(parseFloat(humanData.CV7_X) - humanoidOffsetX , parseFloat(humanData.CV7_Y) - humanoidOffsetY  + offset, parseFloat(humanData.CV7_Z) - humanoidOffsetZ ) ,
        midHip);


    rightShoulder = createCylinder(new THREE.Vector3(parseFloat(humanData.CV7_X) - humanoidOffsetX , parseFloat(humanData.CV7_Y) - humanoidOffsetY  + offset, parseFloat(humanData.CV7_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.R_SAE_X) - humanoidOffsetX , parseFloat(humanData.R_SAE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_SAE_Z) - humanoidOffsetZ ));


    leftShoulder = createCylinder(new THREE.Vector3(parseFloat(humanData.L_SAE_X) - humanoidOffsetX , parseFloat(humanData.L_SAE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_SAE_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.CV7_X) - humanoidOffsetX , parseFloat(humanData.CV7_Y) - humanoidOffsetY  + offset, parseFloat(humanData.CV7_Z) - humanoidOffsetZ ));


    //Upper R Arm
    rightUpperArm = createCylinder(new THREE.Vector3(parseFloat(humanData.R_SAE_X) - humanoidOffsetX , parseFloat(humanData.R_SAE_Y) - humanoidOffsetY + offset, parseFloat(humanData.R_SAE_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.R_HLE_X) - humanoidOffsetX , parseFloat(humanData.R_HLE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_HLE_Z) - humanoidOffsetZ ));

    //Lower R Arm
    rightLowerArm = createCylinder(new THREE.Vector3(parseFloat(humanData.R_HLE_X) - humanoidOffsetX , parseFloat(humanData.R_HLE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_HLE_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_RSP_X) - humanoidOffsetX , parseFloat(humanData.R_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ ));

    //R hand finger 2
    rightFinger2 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_RSP_X) - humanoidOffsetX , parseFloat(humanData.R_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_HM2_X) - humanoidOffsetX , parseFloat(humanData.R_HM2_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_HM2_Z) - humanoidOffsetZ ));

    //R hand finger 5
    rightFinger5 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_RSP_X) - humanoidOffsetX , parseFloat(humanData.R_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_HM5_X) - humanoidOffsetX , parseFloat(humanData.R_HM5_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_HM5_Z) - humanoidOffsetZ ));

    //Lower L leg
    leftLowerLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.L_TTC_X) - humanoidOffsetX , parseFloat(humanData.L_TTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_TTC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_FCC_X) - humanoidOffsetX , parseFloat(humanData.L_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ ));

    //L toe 1
    leftToe1 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X) - humanoidOffsetX , parseFloat(humanData.L_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_FM1_X) - humanoidOffsetX , parseFloat(humanData.L_FM1_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FM1_Z) - humanoidOffsetZ ));

    //L toe 2
    leftToe2 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X) - humanoidOffsetX , parseFloat(humanData.L_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_FM2_X) - humanoidOffsetX , parseFloat(humanData.L_FM2_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FM2_Z) - humanoidOffsetZ ));

    //L toe 5
    leftToe5 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X) - humanoidOffsetX , parseFloat(humanData.L_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_FM5_X) - humanoidOffsetX , parseFloat(humanData.L_FM5_Y) - humanoidOffsetY + offset, parseFloat(humanData.L_FM5_Z) - humanoidOffsetZ ));

    //Upper L Arm
    leftUpperArm = createCylinder(new THREE.Vector3(parseFloat(humanData.L_SAE_X) - humanoidOffsetX , parseFloat(humanData.L_SAE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_SAE_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.L_HLE_X) - humanoidOffsetX , parseFloat(humanData.L_HLE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_HLE_Z) - humanoidOffsetZ ));

    //L hand finger 2
    leftFinger2 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_RSP_X) - humanoidOffsetX , parseFloat(humanData.L_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_HM2_X) - humanoidOffsetX , parseFloat(humanData.L_HM2_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_HM2_Z) - humanoidOffsetZ ));

    //L hand finger 5
    leftFinger5 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_RSP_X) - humanoidOffsetX , parseFloat(humanData.L_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_HM5_X) - humanoidOffsetX , parseFloat(humanData.L_HM5_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_HM5_Z) - humanoidOffsetZ ));

    //Lower L Arm
    leftLowerArm = createCylinder(new THREE.Vector3(parseFloat(humanData.L_HLE_X) - humanoidOffsetX , parseFloat(humanData.L_HLE_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_HLE_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.L_RSP_X) - humanoidOffsetX , parseFloat(humanData.L_RSP_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ ));

    //L upper leg
    leftUpperLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FTC_X) - humanoidOffsetX , parseFloat(humanData.L_FTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.L_TTC_X) - humanoidOffsetX , parseFloat(humanData.L_TTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.L_TTC_Z) - humanoidOffsetZ ));

    //Lower R leg
    rightLowerLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.R_TTC_X) - humanoidOffsetX , parseFloat(humanData.R_TTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_TTC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_FCC_X) - humanoidOffsetX , parseFloat(humanData.R_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ ));

    //R toe 1
    rightToe1 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X) - humanoidOffsetX , parseFloat(humanData.R_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_FM1_X) - humanoidOffsetX , parseFloat(humanData.R_FM1_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FM1_Z) - humanoidOffsetZ ));

    //R toe 2
    rightToe2 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X) - humanoidOffsetX , parseFloat(humanData.R_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_FM2_X) - humanoidOffsetX , parseFloat(humanData.R_FM2_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FM2_Z) - humanoidOffsetZ ));

    //R toe 5
    rightToe5 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X) - humanoidOffsetX , parseFloat(humanData.R_FCC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ ),
        new THREE.Vector3(parseFloat(humanData.R_FM5_X) - humanoidOffsetX , parseFloat(humanData.R_FM5_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FM5_Z) - humanoidOffsetZ ));

    //Upper R leg
    rightUpperLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FTC_X) - humanoidOffsetX , parseFloat(humanData.R_FTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ ) ,
        new THREE.Vector3(parseFloat(humanData.R_TTC_X) - humanoidOffsetX , parseFloat(humanData.R_TTC_Y) - humanoidOffsetY  + offset, parseFloat(humanData.R_TTC_Z) - humanoidOffsetZ ));



    hips.userData = {
        part: "hip",
        point1: ["L_FTC_X", "L_FTC_Y", "L_FTC_Z"],
        point2: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z"],
        p1data: [parseFloat(humanData.L_FTC_X) - humanoidOffsetX, parseFloat(humanData.L_FTC_Y) - humanoidOffsetY, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_FTC_X) - humanoidOffsetX, parseFloat(humanData.R_FTC_Y) - humanoidOffsetY, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ]
    };
    back.userData = {
        part: "back",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z", "L_FTC_X", "L_FTC_Y", "L_FTC_Z"],
        p1data:  [parseFloat(humanData.CV7_X) - humanoidOffsetX, parseFloat(humanData.CV7_Y) - humanoidOffsetY, parseFloat(humanData.CV7_Z) - humanoidOffsetZ],
        mid1data: [parseFloat(humanData.R_FTC_X) - humanoidOffsetX, parseFloat(humanData.R_FTC_Y) - humanoidOffsetY, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ],
        mid2data: [parseFloat(humanData.L_FTC_X) - humanoidOffsetX, parseFloat(humanData.L_FTC_Y) - humanoidOffsetY, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ]
    };
    rightShoulder.userData = {
        part: "rShoulder",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["R_SAE_X", "R_SAE_Y", "R_SAE_Z"],
        p1data: [parseFloat(humanData.CV7_X) - humanoidOffsetX, parseFloat(humanData.CV7_Y) - humanoidOffsetY, parseFloat(humanData.CV7_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_SAE_X) - humanoidOffsetX, parseFloat(humanData.R_SAE_Y) - humanoidOffsetY, parseFloat(humanData.R_SAE_Z) - humanoidOffsetZ]
    };
    rightUpperArm.userData = {
        part: "rUpperArm",
        point1: ["R_SAE_X", "R_SAE_Y", "R_SAE_Z"],
        point2: ["R_HLE_X", "R_HLE_Y", "R_HLE_Z"],
        p1data: [parseFloat(humanData.R_SAE_X) - humanoidOffsetX, parseFloat(humanData.R_SAE_Y) - humanoidOffsetY, parseFloat(humanData.R_SAE_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_HLE_X) - humanoidOffsetX, parseFloat(humanData.R_HLE_Y) - humanoidOffsetY, parseFloat(humanData.R_HLE_Z) - humanoidOffsetZ]
    };
    rightLowerArm.userData = {
        part: "rLowerArm",
        point1: ["R_HLE_X", "R_HLE_Y", "R_HLE_Z"],
        point2: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"],
        p1data: [parseFloat(humanData.R_HLE_X) - humanoidOffsetX, parseFloat(humanData.R_HLE_Y) - humanoidOffsetY, parseFloat(humanData.R_HLE_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_RSP_X) - humanoidOffsetX, parseFloat(humanData.R_RSP_Y) - humanoidOffsetY, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ]
    };
    rightFinger2.userData = {
        part: "rFinger2",
        point1: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"],
        point2: ["R_HM2_X", "R_HM2_Y", "R_HM2_Z"],
        p1data: [parseFloat(humanData.R_RSP_X) - humanoidOffsetX, parseFloat(humanData.R_RSP_Y) - humanoidOffsetY, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_HM2_X) - humanoidOffsetX, parseFloat(humanData.R_HM2_Y) - humanoidOffsetY, parseFloat(humanData.R_HM2_Z) - humanoidOffsetZ]
    };
    rightFinger5.userData = {
        part: "rFinger5",
        point1: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"],
        point2: ["R_HM5_X", "R_HM5_Y", "R_HM5_Z"],
        p1data: [parseFloat(humanData.R_RSP_X) - humanoidOffsetX, parseFloat(humanData.R_RSP_Y) - humanoidOffsetY, parseFloat(humanData.R_RSP_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_HM5_X) - humanoidOffsetX, parseFloat(humanData.R_HM5_Y) - humanoidOffsetY, parseFloat(humanData.R_HM5_Z) - humanoidOffsetZ]
    };

    leftUpperArm.userData = {
        part: "lUpperArm",
        point1: ["L_SAE_X", "L_SAE_Y", "L_SAE_Z"],
        point2: ["L_HLE_X", "L_HLE_Y", "L_HLE_Z"],
        p1data: [parseFloat(humanData.L_SAE_X) - humanoidOffsetX, parseFloat(humanData.L_SAE_Y) - humanoidOffsetY, parseFloat(humanData.L_SAE_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_HLE_X) - humanoidOffsetX, parseFloat(humanData.L_HLE_Y) - humanoidOffsetY, parseFloat(humanData.L_HLE_Z) - humanoidOffsetZ]
    };
    leftLowerArm.userData = {
        part: "lLowerArm",
        point1: ["L_HLE_X", "L_HLE_Y", "L_HLE_Z"],
        point2: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"],
        p1data: [parseFloat(humanData.L_HLE_X) - humanoidOffsetX, parseFloat(humanData.L_HLE_Y) - humanoidOffsetY, parseFloat(humanData.L_HLE_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_RSP_X) - humanoidOffsetX, parseFloat(humanData.L_RSP_Y) - humanoidOffsetY, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ]
    };
    leftFinger2.userData = {
        part: "lFinger2",
        point1: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"],
        point2: ["L_HM2_X", "L_HM2_Y", "L_HM2_Z"],
        p1data: [parseFloat(humanData.L_RSP_X) - humanoidOffsetX, parseFloat(humanData.L_RSP_Y) - humanoidOffsetY, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_HM2_X) - humanoidOffsetX, parseFloat(humanData.L_HM2_Y) - humanoidOffsetY, parseFloat(humanData.L_HM2_Z) - humanoidOffsetZ]
    };
    leftFinger5.userData = {
        part: "lFinger5",
        point1: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"],
        point2: ["L_HM5_X", "L_HM5_Y", "L_HM5_Z"],
        p1data: [parseFloat(humanData.L_RSP_X) - humanoidOffsetX, parseFloat(humanData.L_RSP_Y) - humanoidOffsetY, parseFloat(humanData.L_RSP_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_HM5_X) - humanoidOffsetX, parseFloat(humanData.L_HM5_Y) - humanoidOffsetY, parseFloat(humanData.L_HM5_Z) - humanoidOffsetZ]
    };

    rightUpperLeg.userData = {
        part: "rUpperLeg",
        point1: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z"],
        point2: ["R_TTC_X", "R_TTC_Y", "R_TTC_Z"],
        p1data: [parseFloat(humanData.R_FTC_X) - humanoidOffsetX, parseFloat(humanData.R_FTC_Y) - humanoidOffsetY, parseFloat(humanData.R_FTC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_TTC_X) - humanoidOffsetX, parseFloat(humanData.R_TTC_Y) - humanoidOffsetY, parseFloat(humanData.R_TTC_Z) - humanoidOffsetZ]
    };
    rightLowerLeg.userData = {
        part: "rLowerLeg",
        point1: ["R_TTC_X", "R_TTC_Y", "R_TTC_Z"],
        point2: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        p1data: [parseFloat(humanData.R_TTC_X) - humanoidOffsetX, parseFloat(humanData.R_TTC_Y) - humanoidOffsetY, parseFloat(humanData.R_TTC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_FCC_X) - humanoidOffsetX, parseFloat(humanData.R_FCC_Y) - humanoidOffsetY, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ]
    };
    rightToe1.userData = {
        part: "rToe1",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM1_X", "R_FM1_Y", "R_FM1_Z"],
        p1data: [parseFloat(humanData.R_FCC_X) - humanoidOffsetX, parseFloat(humanData.R_FCC_Y) - humanoidOffsetY, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_FM1_X) - humanoidOffsetX, parseFloat(humanData.R_FM1_Y) - humanoidOffsetY, parseFloat(humanData.R_FM1_Z) - humanoidOffsetZ]
    };
    rightToe2.userData = {
        part: "rToe2",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM2_X", "R_FM2_Y", "R_FM2_Z"],
        p1data: [parseFloat(humanData.R_FCC_X) - humanoidOffsetX, parseFloat(humanData.R_FCC_Y) - humanoidOffsetY, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_FM2_X) - humanoidOffsetX, parseFloat(humanData.R_FM2_Y) - humanoidOffsetY, parseFloat(humanData.R_FM2_Z) - humanoidOffsetZ]
    };
    rightToe5.userData = {
        part: "rToe5",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM5_X", "R_FM5_Y", "R_FM5_Z"],
        p1data: [parseFloat(humanData.R_FCC_X) - humanoidOffsetX, parseFloat(humanData.R_FCC_Y) - humanoidOffsetY, parseFloat(humanData.R_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.R_FM5_X) - humanoidOffsetX, parseFloat(humanData.R_FM5_Y) - humanoidOffsetY, parseFloat(humanData.R_FM5_Z) - humanoidOffsetZ]
    };
    leftShoulder.userData = {
        part: "lShoulder",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["L_SAE_X", "L_SAE_Y", "L_SAE_Z"],
        p1data: [parseFloat(humanData.CV7_X) - humanoidOffsetX, parseFloat(humanData.CV7_Y) - humanoidOffsetY, parseFloat(humanData.CV7_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_SAE_X) - humanoidOffsetX, parseFloat(humanData.L_SAE_Y) - humanoidOffsetY, parseFloat(humanData.L_SAE_Z) - humanoidOffsetZ]
    };

    leftUpperLeg.userData = {
        part: "lUpperLeg",
        point1: ["L_FTC_X", "L_FTC_Y", "L_FTC_Z"],
        point2: ["L_TTC_X", "L_TTC_Y", "L_TTC_Z"],
        p1data: [parseFloat(humanData.L_FTC_X) - humanoidOffsetX, parseFloat(humanData.L_FTC_Y) - humanoidOffsetY, parseFloat(humanData.L_FTC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_TTC_X) - humanoidOffsetX, parseFloat(humanData.L_TTC_Y) - humanoidOffsetY, parseFloat(humanData.L_TTC_Z) - humanoidOffsetZ]
    };
    leftLowerLeg.userData = {
        part: "lLowerLeg",
        point1: ["L_TTC_X", "L_TTC_Y", "L_TTC_Z"],
        point2: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        p1data: [parseFloat(humanData.L_TTC_X) - humanoidOffsetX, parseFloat(humanData.L_TTC_Y) - humanoidOffsetY, parseFloat(humanData.L_TTC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_FCC_X) - humanoidOffsetX, parseFloat(humanData.L_FCC_Y) - humanoidOffsetY, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ]
    };
    leftToe1.userData = {
        part: "lToe1",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM1_X", "L_FM1_Y", "L_FM1_Z"],
        p1data: [parseFloat(humanData.L_FCC_X) - humanoidOffsetX, parseFloat(humanData.L_FCC_Y) - humanoidOffsetY, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_FM1_X) - humanoidOffsetX, parseFloat(humanData.L_FM1_Y) - humanoidOffsetY, parseFloat(humanData.L_FM1_Z) - humanoidOffsetZ]
    };
    leftToe2.userData = {
        part: "lToe2",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM2_X", "L_FM2_Y", "L_FM2_Z"],
        p1data: [parseFloat(humanData.L_FCC_X) - humanoidOffsetX, parseFloat(humanData.L_FCC_Y) - humanoidOffsetY, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_FM2_X) - humanoidOffsetX, parseFloat(humanData.L_FM2_Y) - humanoidOffsetY, parseFloat(humanData.L_FM2_Z) - humanoidOffsetZ]
    };
    leftToe5.userData = {
        part: "lToe5",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM5_X", "L_FM5_Y", "L_FM5_Z"],
        p1data: [parseFloat(humanData.L_FCC_X) - humanoidOffsetX, parseFloat(humanData.L_FCC_Y) - humanoidOffsetY, parseFloat(humanData.L_FCC_Z) - humanoidOffsetZ],
        p2data: [parseFloat(humanData.L_FM5_X) - humanoidOffsetX, parseFloat(humanData.L_FM5_Y) - humanoidOffsetY, parseFloat(humanData.L_FM5_Z) - humanoidOffsetZ]
    };

    partsArray = [back, hips,
        leftUpperArm, leftLowerArm, leftFinger2, leftFinger5, leftShoulder,
        rightUpperArm, rightLowerArm, rightFinger5, rightFinger2, rightShoulder,
        leftUpperLeg, leftLowerLeg, leftToe1, leftToe2, leftToe5,
        rightUpperLeg, rightLowerLeg, rightToe1, rightToe2, rightToe5];

    partsArray.forEach(function (d,i) {
        if(!isNaN(d.position.x) && !isNaN(d.quaternion.x) && !isNaN(d.rotation.x)){
            humanoid.add(d);
        }
    });

    participant.add(humanoid);
}