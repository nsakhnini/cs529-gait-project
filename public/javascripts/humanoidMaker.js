let participant, points = [];
let humanoid, back, hips,
    leftUpperArm, leftLowerArm, leftFinger2, leftFinger5, leftShoulder,
    rightUpperArm, rightLowerArm, rightFinger5, rightFinger2, rightShoulder,
    leftUpperLeg, leftLowerLeg, leftToe1, leftToe2, leftToe5,
    rightUpperLeg, rightLowerLeg, rightToe1, rightToe2, rightToe5, midHip;
let edgeGeometry, edge, updatedVector, direction;

const factor = new THREE.Matrix4();

factor.set(1,0,0,0,
    0,0,1,0,
    0,-1,0,0,
    0,0,0,1);

const edgeMaterial =  new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const upVector = new THREE.Object3D().up;
const orientation = new THREE.Matrix4();

var createCylinder = function( pointX, pointY) {
    direction = new THREE.Vector3().subVectors( pointY, pointX );
    orientation.lookAt(pointX, pointY, upVector);

    console.log(direction);
    orientation.multiply(factor);

    // radius top, radius bottom, height, radius segments, height segments
    edgeGeometry = new THREE.CylinderGeometry( 5, 5, direction.length(), 4, 1 );

    edge = new THREE.Mesh( edgeGeometry, edgeMaterial)
    edge.applyMatrix4(orientation);

    updatedVector = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5));
    edge.position.x = updatedVector.x;
    edge.position.y = updatedVector.y;
    edge.position.z = updatedVector.z;

    return edge;
}

export function createHumanoid(humanData, offset, demo_data, scene){
    //dot geometry
    let geometry = new THREE.SphereBufferGeometry(0.01, 0.01, 0.01);
    participant = new THREE.Group();
    points = [];

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


    drawHumanoid(humanData,offset, participant);
    scene.add(participant);
    console.log("done adding participant");
}

function drawPoint(geometry, x,y,z,pid, joint){
    let meshMaterial = new THREE.MeshBasicMaterial();
    meshMaterial.color.setHex(0xeb3434);
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.x = x;
    mesh.position.y = z;
    mesh.position.z =y;

    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1000;

    points.push( new THREE.Vector3( x, y, z ));
    //points.push({ id: pid, name: joint, vector: new THREE.Vector3( x, y, z ) });
    //If needed to add later data to points
    mesh.userData = {id: pid, joint: joint};
    return mesh;
}

export function drawHumanoid(humanData , offset, participant){

    //TODO: Update current humanoid instead of creating new one, current setting is breaking the memory

    humanoid = new THREE.Group();

    hips = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FTC_X), parseFloat(humanData.L_FTC_Y) + offset, parseFloat(humanData.L_FTC_Z)) ,
        new THREE.Vector3(parseFloat(humanData.R_FTC_X), parseFloat(humanData.R_FTC_Y) + offset, parseFloat(humanData.R_FTC_Z)));

    midHip = new THREE.Vector3(((parseFloat(humanData.L_FTC_X) + parseFloat(humanData.R_FTC_X))/2) ,
        ((parseFloat(humanData.L_FTC_Y) + parseFloat(humanData.R_FTC_Y))/2) + offset ,
        ((parseFloat(humanData.L_FTC_Z) + parseFloat(humanData.R_FTC_Z))/2));
    back = createCylinder(new THREE.Vector3(parseFloat(humanData.CV7_X), parseFloat(humanData.CV7_Y) + offset, parseFloat(humanData.CV7_Z)) ,
        midHip);


    rightShoulder = createCylinder(new THREE.Vector3(parseFloat(humanData.CV7_X), parseFloat(humanData.CV7_Y) + offset, parseFloat(humanData.CV7_Z)) ,
        new THREE.Vector3(parseFloat(humanData.R_SAE_X), parseFloat(humanData.R_SAE_Y) + offset, parseFloat(humanData.R_SAE_Z)));


    leftShoulder = createCylinder(new THREE.Vector3(parseFloat(humanData.L_SAE_X), parseFloat(humanData.L_SAE_Y) + offset, parseFloat(humanData.L_SAE_Z)) ,
        new THREE.Vector3(parseFloat(humanData.CV7_X), parseFloat(humanData.CV7_Y) + offset, parseFloat(humanData.CV7_Z)));


    //Upper R Arm
    rightUpperArm = createCylinder(new THREE.Vector3(parseFloat(humanData.R_SAE_X), parseFloat(humanData.R_SAE_Y)+ offset, parseFloat(humanData.R_SAE_Z)) ,
        new THREE.Vector3(parseFloat(humanData.R_HLE_X), parseFloat(humanData.R_HLE_Y) + offset, parseFloat(humanData.R_HLE_Z)));

    //Lower R Arm
    rightLowerArm = createCylinder(new THREE.Vector3(parseFloat(humanData.R_HLE_X), parseFloat(humanData.R_HLE_Y) + offset, parseFloat(humanData.R_HLE_Z)),
        new THREE.Vector3(parseFloat(humanData.R_RSP_X), parseFloat(humanData.R_RSP_Y) + offset, parseFloat(humanData.R_RSP_Z)));

    //R hand finger 2
    rightFinger2 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_RSP_X), parseFloat(humanData.R_RSP_Y) + offset, parseFloat(humanData.R_RSP_Z)),
        new THREE.Vector3(parseFloat(humanData.R_HM2_X), parseFloat(humanData.R_HM2_Y) + offset, parseFloat(humanData.R_HM2_Z)));

    //R hand finger 5
    rightFinger5 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_RSP_X), parseFloat(humanData.R_RSP_Y) + offset, parseFloat(humanData.R_RSP_Z)),
        new THREE.Vector3(parseFloat(humanData.R_HM5_X), parseFloat(humanData.R_HM5_Y) + offset, parseFloat(humanData.R_HM5_Z)));

    //Lower L leg
    leftLowerLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.L_TTC_X), parseFloat(humanData.L_TTC_Y) + offset, parseFloat(humanData.L_TTC_Z)),
        new THREE.Vector3(parseFloat(humanData.L_FCC_X), parseFloat(humanData.L_FCC_Y) + offset, parseFloat(humanData.L_FCC_Z)));

    //L toe 1
    leftToe1 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X), parseFloat(humanData.L_FCC_Y) + offset, parseFloat(humanData.L_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.L_FM1_X), parseFloat(humanData.L_FM1_Y) + offset, parseFloat(humanData.L_FM1_Z)));

    //L toe 2
    leftToe2 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X), parseFloat(humanData.L_FCC_Y) + offset, parseFloat(humanData.L_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.L_FM2_X), parseFloat(humanData.L_FM2_Y) + offset, parseFloat(humanData.L_FM2_Z)));

    //L toe 5
    leftToe5 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FCC_X), parseFloat(humanData.L_FCC_Y) + offset, parseFloat(humanData.L_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.L_FM5_X), parseFloat(humanData.L_FM5_Y)+ offset, parseFloat(humanData.L_FM5_Z)));

    //Upper L Arm
    leftUpperArm = createCylinder(new THREE.Vector3(parseFloat(humanData.L_SAE_X), parseFloat(humanData.L_SAE_Y) + offset, parseFloat(humanData.L_SAE_Z)) ,
        new THREE.Vector3(parseFloat(humanData.L_HLE_X), parseFloat(humanData.L_HLE_Y) + offset, parseFloat(humanData.L_HLE_Z)));

    //L hand finger 2
    leftFinger2 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_RSP_X), parseFloat(humanData.L_RSP_Y) + offset, parseFloat(humanData.L_RSP_Z)),
        new THREE.Vector3(parseFloat(humanData.L_HM2_X), parseFloat(humanData.L_HM2_Y) + offset, parseFloat(humanData.L_HM2_Z)));

    //L hand finger 5
    leftFinger5 = createCylinder(new THREE.Vector3(parseFloat(humanData.L_RSP_X), parseFloat(humanData.L_RSP_Y) + offset, parseFloat(humanData.L_RSP_Z)),
        new THREE.Vector3(parseFloat(humanData.L_HM5_X), parseFloat(humanData.L_HM5_Y) + offset, parseFloat(humanData.L_HM5_Z)));

    //Lower L Arm
    leftLowerArm = createCylinder(new THREE.Vector3(parseFloat(humanData.L_HLE_X), parseFloat(humanData.L_HLE_Y) + offset, parseFloat(humanData.L_HLE_Z)),
        new THREE.Vector3(parseFloat(humanData.L_RSP_X), parseFloat(humanData.L_RSP_Y) + offset, parseFloat(humanData.L_RSP_Z)));

    //L upper leg
    leftUpperLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.L_FTC_X), parseFloat(humanData.L_FTC_Y) + offset, parseFloat(humanData.L_FTC_Z)) ,
        new THREE.Vector3(parseFloat(humanData.L_TTC_X), parseFloat(humanData.L_TTC_Y) + offset, parseFloat(humanData.L_TTC_Z)));

    //Lower R leg
    rightLowerLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.R_TTC_X), parseFloat(humanData.R_TTC_Y) + offset, parseFloat(humanData.R_TTC_Z)),
        new THREE.Vector3(parseFloat(humanData.R_FCC_X), parseFloat(humanData.R_FCC_Y) + offset, parseFloat(humanData.R_FCC_Z)));

    //R toe 1
    rightToe1 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X), parseFloat(humanData.R_FCC_Y) + offset, parseFloat(humanData.R_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.R_FM1_X), parseFloat(humanData.R_FM1_Y) + offset, parseFloat(humanData.R_FM1_Z)));

    //R toe 2
    rightToe2 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X), parseFloat(humanData.R_FCC_Y) + offset, parseFloat(humanData.R_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.R_FM2_X), parseFloat(humanData.R_FM2_Y) + offset, parseFloat(humanData.R_FM2_Z)));

    //R toe 5
    rightToe5 = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FCC_X), parseFloat(humanData.R_FCC_Y) + offset, parseFloat(humanData.R_FCC_Z)),
        new THREE.Vector3(parseFloat(humanData.R_FM5_X), parseFloat(humanData.R_FM5_Y) + offset, parseFloat(humanData.R_FM5_Z)));

    //Upper R leg
    rightUpperLeg = createCylinder(new THREE.Vector3(parseFloat(humanData.R_FTC_X), parseFloat(humanData.R_FTC_Y) + offset, parseFloat(humanData.R_FTC_Z)) ,
        new THREE.Vector3(parseFloat(humanData.R_TTC_X), parseFloat(humanData.R_TTC_Y) + offset, parseFloat(humanData.R_TTC_Z)));



    hips.userData = {
        part: "hip",
        point1: ["L_FTC_X", "L_FTC_Y", "L_FTC_Z"],
        point2: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z"],
        //Add current vector
        //vector: new THREE.Vector3();
    };
    back.userData = {
        part: "back",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z", "L_FTC_X", "L_FTC_Y", "L_FTC_Z"]
    };
    rightShoulder.userData = {
        part: "rShoulder",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["R_SAE_X", "R_SAE_Y", "R_SAE_Z"]
    };
    rightUpperArm.userData = {
        part: "rUpperArm",
        point1: ["R_SAE_X", "R_SAE_Y", "R_SAE_Z"],
        point2: ["R_HLE_X", "R_HLE_Y", "R_HLE_Z"]
    };
    rightLowerArm.userData = {
        part: "rLowerArm",
        point1: ["R_HLE_X", "R_HLE_Y", "R_HLE_Z"],
        point2: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"]
    };
    rightFinger2.userData = {
        part: "rFinger2",
        point1: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"],
        point2: ["R_HM2_X", "R_HM2_Y", "R_HM2_Z"]
    };
    rightFinger5.userData = {
        part: "rFinger5",
        point1: ["R_RSP_X", "R_RSP_Y", "R_RSP_Z"],
        point2: ["R_HM5_X", "R_HM5_Y", "R_HM5_Z"]
    };

    leftUpperArm.userData = {
        part: "lUpperArm",
        point1: ["L_SAE_X", "L_SAE_Y", "L_SAE_Z"],
        point2: ["L_HLE_X", "L_HLE_Y", "L_HLE_Z"]
    };
    leftLowerArm.userData = {
        part: "lLowerArm",
        point1: ["L_HLE_X", "L_HLE_Y", "L_HLE_Z"],
        point2: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"]
    };
    leftFinger2.userData = {
        part: "lFinger2",
        point1: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"],
        point2: ["L_HM2_X", "L_HM2_Y", "L_HM2_Z"]
    };
    leftFinger5.userData = {
        part: "lFinger5",
        point1: ["L_RSP_X", "L_RSP_Y", "L_RSP_Z"],
        point2: ["L_HM5_X", "L_HM5_Y", "L_HM5_Z"]
    };

    rightUpperLeg.userData = {
        part: "rUpperLeg",
        point1: ["R_FTC_X", "R_FTC_Y", "R_FTC_Z"],
        point2: ["R_TTC_X", "R_TTC_Y", "R_TTC_Z"]
    };
    rightLowerLeg.userData = {
        part: "rLowerLeg",
        point1: ["R_TTC_X", "R_TTC_Y", "R_TTC_Z"],
        point2: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"]
    };
    rightToe1.userData = {
        part: "rToe1",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM1_X", "R_FM1_Y", "R_FM1_Z"]
    };
    rightToe2.userData = {
        part: "rToe2",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM2_X", "R_FM2_Y", "R_FM2_Z"]
    };
    rightToe5.userData = {
        part: "rToe5",
        point1: ["R_FCC_X", "R_FCC_Y", "R_FCC_Z"],
        point2: ["R_FM5_X", "R_FM5_Y", "R_FM5_Z"]
    };
    leftShoulder.userData = {
        part: "lShoulder",
        point1: ["CV7_X", "CV7_Y", "CV7_Z"],
        point2: ["L_SAE_X", "L_SAE_Y", "L_SAE_Z"]
    };

    leftUpperLeg.userData = {
        part: "lUpperLeg",
        point1: ["L_FTC_X", "L_FTC_Y", "L_FTC_Z"],
        point2: ["L_TTC_X", "L_TTC_Y", "L_TTC_Z"]
    };
    leftLowerLeg.userData = {
        part: "lLowerLeg",
        point1: ["L_TTC_X", "L_TTC_Y", "L_TTC_Z"],
        point2: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"]
    };
    leftToe1.userData = {
        part: "lToe1",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM1_X", "L_FM1_Y", "L_FM1_Z"]
    };
    leftToe2.userData = {
        part: "lToe2",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM2_X", "L_FM2_Y", "L_FM2_Z"]
    };
    leftToe5.userData = {
        part: "lToe5",
        point1: ["L_FCC_X", "L_FCC_Y", "L_FCC_Z"],
        point2: ["L_FM5_X", "L_FM5_Y", "L_FM5_Z"]
    };

    humanoid.add(hips);
    humanoid.add(back);
    humanoid.add(rightShoulder);
    humanoid.add(leftShoulder);
    humanoid.add(rightUpperArm);
    humanoid.add(rightLowerArm);
    humanoid.add(rightFinger2);
    humanoid.add(rightFinger5);
    humanoid.add(rightUpperLeg);
    humanoid.add(rightLowerLeg);
    humanoid.add(rightToe1);
    humanoid.add(rightToe2);
    humanoid.add(rightToe5);
    humanoid.add(leftUpperArm);
    humanoid.add(leftLowerArm);
    humanoid.add(leftFinger2);
    humanoid.add(leftFinger5);
    humanoid.add(leftUpperLeg);
    humanoid.add(leftLowerLeg);
    humanoid.add(leftToe1);
    humanoid.add(leftToe2);
    humanoid.add(leftToe5);


    //console.log(humanoid);
    participant.add(humanoid);
    //return humanoid;
}