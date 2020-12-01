/*
Links:
Updated Markers: note that markers_id_speed_trial
data files:
https://gait-visualizer.s3.amazonaws.com/markers/markers_2014001_1_1.csv
 */

import {filterDemo, clearFilterDemo, filterMarkers, clearFilterMarkers, updateSpeed, updateTrial, load3DView, scene} from "./mainSceneMaker.js";

var demo_file = "https://gait-visualizer.s3.amazonaws.com/Demographics.csv";
var footsteps_file = "./data/footsteps.csv";

let link, baseLink = "https://gait-visualizer.s3.amazonaws.com/markers/markers_";

var demoData = [];
let minAge = 100, maxAge = 0, minHeight = 100, maxHeight = 0, minWeight = 100, maxWeight = 0;

async function loadDemoData() {
    await d3.csv(demo_file, function (d){
        demoData.push(d);
    })

    demoData.forEach(function (d){
        d.Age = parseFloat(d.Age);
        d.Height = parseFloat(d.Height);
        d.Weight = parseFloat(d.Weight);
        d["Right leg length"] = parseFloat(d["Right leg length"])
        d["Left leg length"] = parseFloat(d["Left leg length"])
        d.Gender = parseFloat(d["Gender(0-woman 1-man)"]);
        d.Left_leg_length = parseFloat(d["Left leg length"]).toFixed(2);
        d.Right_leg_length = parseFloat(d["Right leg length"]).toFixed(2);
    });

    demoData.forEach(function (d) {
        //Find min values
        if(d.Age < minAge)
            minAge = d.Age;
        if(d.Height < minHeight)
            minHeight = d.Height;
        if(d.Weight < minWeight)
            minWeight = d.Weight;

        //find max values
        if(d.Age > maxAge)
            maxAge = d.Age;
        if(d.Height > maxHeight)
            maxHeight = d.Height;
        if(d.Weight > maxWeight)
            maxWeight = d.Weight;
    });
    //Error: 2015026  2014051 2014030

    let dataList1 = ["2014011", "2014029", "2014016", "2014019", "2015017", "2015026",
        "2015021", "2015043", "2015020", "2015027", "2015042", "2015005",
        "2015002", "2015003", "2015004", "2015032", "2015035", "2014050",
        "2014003", "2014004", "2014051", "2014034", "2014033", "2014005",
        "2014002", "2014046", "2014048", "2014024", "2014015", "2014049",
        "2014040", "2014013", "2014014", "2014022", "2014025", "2015013",
        "2015041", "2015015", "2015030", "2015037", "2015007", "2014007",
        "2014009", "2014031",
        "2014053", "2014030", "2014008", "2014001", "2014006", "2014052"]

    var dataList = ["2014053", "2014030", "2014008", "2014001", "2014006", "2014052"]

    initData(18, 85, -1,-1,-1,80,-1,3,2,dataList);
}

export async function filterData(ageLower = -1, ageUpper = -1, heightLower = -1, heightUpper = -1, weightLower =-1, weightUpper = -1,
                                 gender = -1, speed = -1, trial= -1, pIDs = []) {

    //Subset demographic data to current participant selection
    clearFilterDemo();
    if(pIDs.length == 0) {
        if (ageLower == -1) {
            ageLower = minAge;
        }
        if (ageUpper == -1) {
            ageUpper = maxAge;
        }
        if (heightLower == -1) {
            heightLower = minHeight;
        }
        if (heightUpper == -1) {
            heightUpper = maxHeight;
        }
        if (weightLower == -1) {
            weightLower = minWeight;
        }
        if (weightUpper == -1) {
            weightUpper = maxAge;
        }

        demoData.forEach(function (d, i) {
            if ((d.Age >= ageLower && d.Age <= ageUpper) && (d.Height >= heightLower && d.Height <= heightUpper) && (d.Weight >= weightLower && d.Weight <= weightUpper)) {
                if (gender == -1) {
                    filterDemo.push(d);
                } else {
                    if (d.Gender == gender) {
                        filterDemo.push(d);
                    }
                }
            }
        });
    }
    else{
        //if participant selection is made, ignore all other filters
        demoData.forEach(function (d, i) {
            if(pIDs.indexOf(d.ID) >= 0){
                filterDemo.push(d);
            }
        });
    }


    //Here filterDemo has the demographic information for filtered participants
    //Now load their markers data

    clearFilterMarkers();

    if(filterDemo.length == 0){
        updateSpeed(speed);
        updateTrial(trial);
    }
    else {
        for (let i = 0; i < filterDemo.length; i++) {
            if (speed == -1)
                speed = 1;
            if (trial == -1)
                trial = 1;

            link = baseLink + filterDemo[i].ID + "_" + speed + "_" + trial + ".csv";
            await d3.csv(link, function (d) {
                d.Speed = String(parseInt(d.Speed));
                d.Trial = String(parseInt(d.Trial));
                filterMarkers.push(d);
            });
        }
        updateSpeed(speed);
        updateTrial(trial);


        load3DView();
    }


}


export async function initData(ageLower = -1, ageUpper = -1, heightLower = -1, heightUpper = -1, weightLower =-1, weightUpper = -1,
                                 gender = -1, speed = -1, trial= -1, pIDs = []) {
        //Subset demographic data to current participant selection
        clearFilterDemo();
        if(pIDs.length == 0) {
            if (ageLower == -1) {
                ageLower = minAge;
            }
            if (ageUpper == -1) {
                ageUpper = maxAge;
            }
            if (heightLower == -1) {
                heightLower = minHeight;
            }
            if (heightUpper == -1) {
                heightUpper = maxHeight;
            }
            if (weightLower == -1) {
                weightLower = minWeight;
            }
            if (weightUpper == -1) {
                weightUpper = maxAge;
            }

            demoData.forEach(function (d, i) {
                if ((d.Age >= ageLower && d.Age <= ageUpper) && (d.Height >= heightLower && d.Height <= heightUpper) && (d.Weight >= weightLower && d.Weight <= weightUpper)) {
                    if (gender == -1) {
                        filterDemo.push(d);
                    } else {
                        if (d.Gender == gender) {
                            filterDemo.push(d);
                        }
                    }
                }
            });
        }
        else{
            //if participant selection is made, ignore all other filters
            demoData.forEach(function (d, i) {
                if(pIDs.indexOf(d.ID) >= 0){
                    filterDemo.push(d);
                }
            });
        }


        //Here filterDemo has the demographic information for filtered participants
        //Now load their markers data

        clearFilterMarkers();

        if(filterDemo.length == 0){
            scene.children.forEach(function (d){
                if(typeof d.userData.id !== 'undefined')
                    scene.remove(d);
            });
            updateSpeed(speed);
            updateTrial(trial);
        }
        else {
            for (let i = 0; i < filterDemo.length; i++) {
                if (speed == -1)
                    speed = 1;
                if (trial == -1)
                    trial = 1;

                link = baseLink + filterDemo[i].ID + "_" + speed + "_" + trial + ".csv";
                await d3.csv(link, function (d) {
                    d.Speed = String(parseInt(d.Speed));
                    d.Trial = String(parseInt(d.Trial));
                    filterMarkers.push(d);
                });
            }
            updateSpeed(speed);
            updateTrial(trial);

            scene.children.forEach(function (d){
                if(typeof d.userData.id !== 'undefined')
                    scene.remove(d);
            });

            load3DView();
        }

}
loadDemoData();

