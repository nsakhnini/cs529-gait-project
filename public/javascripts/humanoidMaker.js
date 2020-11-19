let participant,bone, bones = [];

function createBones(boneData) {
    bone = new THREE.Bone()
    bone.name = boneData.name;
    bone.position.x = boneData.x;
    bone.position.y = boneData.y;
    bone.position.z = boneData.z;
    if (boneData.scaleX !== undefined) {
        bone.scale.x = boneData.scaleX;
        bone.scale.y = boneData.scaleY;
        bone.scale.z = boneData.scaleZ;
    }
}

function createBoneData(humanData){
    bones.push({ x: humanData.CV7_X, y: humanData.CV7_Y, z: humanData.CV7_Z, participant: humanData.Participant, name: "CV7", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FAL_X, y: humanData.L_FAL_Y, z: humanData.L_FAL_Z, participant: humanData.Participant, name: "L_FAL", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FAX_X, y: humanData.L_FAX_Y, z: humanData.L_FAX_Z, participant: humanData.Participant, name: "L_FAX", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FCC_X, y: humanData.L_FCC_Y, z: humanData.L_FCC_Z, participant: humanData.Participant, name: "L_FCC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FLE_X, y: humanData.L_FLE_Y, z: humanData.L_FLE_Z, participant: humanData.Participant, name: "L_FLE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FM1_X, y: humanData.L_FM1_Y, z: humanData.L_FM1_Z, participant: humanData.Participant, name: "L_FM1", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FM2_X, y: humanData.L_FM2_Y, z: humanData.L_FM2_Z, participant: humanData.Participant, name: "L_FM2", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FM5_X, y: humanData.L_FM5_Y, z: humanData.L_FM5_Z, participant: humanData.Participant, name: "L_FM5", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FME_X, y: humanData.L_FME_Y, z: humanData.L_FME_Z, participant: humanData.Participant, name: "L_FME", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_FTC_X, y: humanData.L_FTC_Y, z: humanData.L_FTC_Z, participant: humanData.Participant, name: "L_FTC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_HLE_X, y: humanData.L_HLE_Y, z: humanData.L_HLE_Z, participant: humanData.Participant, name: "L_HLE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_HM2_X, y: humanData.L_HM2_Y, z: humanData.L_HM2_Z, participant: humanData.Participant, name: "L_HM2", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_HM5_X, y: humanData.L_HM5_Y, z: humanData.L_HM5_Z, participant: humanData.Participant, name: "L_HM5", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_HME_X, y: humanData.L_HME_Y, z: humanData.L_HME_Z, participant: humanData.Participant, name: "L_HME", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_IAS_X, y: humanData.L_IAS_Y, z: humanData.L_IAS_Z, participant: humanData.Participant, name: "L_IAS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_IPS_X, y: humanData.L_IPS_Y, z: humanData.L_IPS_Z, participant: humanData.Participant, name: "L_IPS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_RSP_X, y: humanData.L_RSP_Y, z: humanData.L_RSP_Z, participant: humanData.Participant, name: "L_RSP", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_SAA_X, y: humanData.L_SAA_Y, z: humanData.L_SAA_Z, participant: humanData.Participant, name: "L_SAA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_SAE_X, y: humanData.L_SAE_Y, z: humanData.L_SAE_Z, participant: humanData.Participant, name: "L_SAE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_SIA_X, y: humanData.L_SIA_Y, z: humanData.L_SIA_Z, participant: humanData.Participant, name: "L_SIA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_SRS_X, y: humanData.L_SRS_Y, z: humanData.L_SRS_Z, participant: humanData.Participant, name: "L_SRS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_TAM_X, y: humanData.L_TAM_Y, z: humanData.L_TAM_Z, participant: humanData.Participant, name: "L_TAM", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_TTC_X, y: humanData.L_TTC_Y, z: humanData.L_TTC_Z, participant: humanData.Participant, name: "L_TTC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_UHE_X, y: humanData.L_UHE_Y, z: humanData.L_UHE_Z, participant: humanData.Participant, name: "L_UHE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.L_UOA_X, y: humanData.L_UOA_Y, z: humanData.L_UOA_Z, participant: humanData.Participant, name: "L_UOA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FAL_X, y: humanData.R_FAL_Y, z: humanData.R_FAL_Z, participant: humanData.Participant, name: "R_FAL", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FAX_X, y: humanData.R_FAX_Y, z: humanData.R_FAX_Z, participant: humanData.Participant, name: "R_FAX", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FCC_X, y: humanData.R_FCC_Y, z: humanData.R_FCC_Z, participant: humanData.Participant, name: "R_FCC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FLE_X, y: humanData.R_FLE_Y, z: humanData.R_FLE_Z, participant: humanData.Participant, name: "R_FLE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FM1_X, y: humanData.R_FM1_Y, z: humanData.R_FM1_Z, participant: humanData.Participant, name: "R_FM1", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FM2_X, y: humanData.R_FM2_Y, z: humanData.R_FM2_Z, participant: humanData.Participant, name: "R_FM2", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FM5_X, y: humanData.R_FM5_Y, z: humanData.R_FM5_Z, participant: humanData.Participant, name: "R_FM5", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FME_X, y: humanData.R_FME_Y, z: humanData.R_FME_Z, participant: humanData.Participant, name: "R_FME", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_FTC_X, y: humanData.R_FTC_Y, z: humanData.R_FTC_Z, participant: humanData.Participant, name: "R_FTC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_HLE_X, y: humanData.R_HLE_Y, z: humanData.R_HLE_Z, participant: humanData.Participant, name: "R_HLE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_HM2_X, y: humanData.R_HM2_Y, z: humanData.R_HM2_Z, participant: humanData.Participant, name: "R_HM2", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_HM5_X, y: humanData.R_HM5_Y, z: humanData.R_HM5_Z, participant: humanData.Participant, name: "R_HM5", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_HME_X, y: humanData.R_HME_Y, z: humanData.R_HME_Z, participant: humanData.Participant, name: "R_HME", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_IAS_X, y: humanData.R_IAS_Y, z: humanData.R_IAS_Z, participant: humanData.Participant, name: "R_IAS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_IPS_X, y: humanData.R_IPS_Y, z: humanData.R_IPS_Z, participant: humanData.Participant, name: "R_IPS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_RSP_X, y: humanData.R_RSP_Y, z: humanData.R_RSP_Z, participant: humanData.Participant, name: "R_RSP", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_SAA_X, y: humanData.R_SAA_Y, z: humanData.R_SAA_Z, participant: humanData.Participant, name: "R_SAA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_SAE_X, y: humanData.R_SAE_Y, z: humanData.R_SAE_Z, participant: humanData.Participant, name: "R_SAE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_SIA_X, y: humanData.R_SIA_Y, z: humanData.R_SIA_Z, participant: humanData.Participant, name: "R_SIA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_SRS_X, y: humanData.R_SRS_Y, z: humanData.R_SRS_Z, participant: humanData.Participant, name: "R_SRS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_TAM_X, y: humanData.R_TAM_Y, z: humanData.R_TAM_Z, participant: humanData.Participant, name: "R_TAM", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_TTC_X, y: humanData.R_TTC_Y, z: humanData.R_TTC_Z, participant: humanData.Participant, name: "R_TTC", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_UHE_X, y: humanData.R_UHE_Y, z: humanData.R_UHE_Z, participant: humanData.Participant, name: "R_UHE", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.R_UOA_X, y: humanData.R_UOA_Y, z: humanData.R_UOA_Z, participant: humanData.Participant, name: "R_UOA", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.SJN_X, y: humanData.SJN_Y, z: humanData.SJN_Z, participant: humanData.Participant, name: "SJN", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.SXS_X, y: humanData.SXS_Y, z: humanData.SXS_Z, participant: humanData.Participant, name: "SXS", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    bones.push({ x: humanData.TV10_X, y: humanData.TV10_Y, z: humanData.TV10_Z, participant: humanData.Participant, name: "TV10", scaleX: 1 , scaleY: 1 , scaleZ: 1});
    console.log(bones);
}

export function createHumanoid(humanData, offset, demo, theScene){
    console.log(humanData);
    createBoneData(humanData);
}