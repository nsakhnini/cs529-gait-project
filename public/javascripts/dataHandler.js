/*
Links:
https://cs529.s3.us-east-2.amazonaws.com/EMG_full.csv
https://cs529.s3.us-east-2.amazonaws.com/ForcePlate_full.csv
https://cs529.s3.us-east-2.amazonaws.com/Markers_full.csv
https://cs529.s3.us-east-2.amazonaws.com/Demographics.csv

Updated Markers: note that markers_id_speed_trial
empty files:
https://gait-visualizer.s3.amazonaws.com/empty/markers_2014006_2_5.csv
data files:
https://gait-visualizer.s3.amazonaws.com/markers/markers_2014001_1_1.csv
 */

import {filterDemo, clearFilterDemo, filterMarkers, clearFilterMarkers, updateSpeed, updateTrial, updateScene, load3DView} from "./mainSceneMaker.js";

//var markers_file = "https://cs529.s3.us-east-2.amazonaws.com/Markers_full.csv";
var demo_file = "https://cs529.s3.us-east-2.amazonaws.com/Demographics.csv";
var footsteps_file = "./data/footsteps.csv";

let link, baseLink = "https://gait-visualizer.s3.amazonaws.com/markers/markers_";

var demoData = [];

let minAge = 100, maxAge = 0, minHeight = 100, maxHeight = 0, minWeight = 100, maxWeight = 0;
async function loadDemoData() {
    await d3.csv(demo_file, function (d) {
        demoData.push(d);
    });

    demoData.forEach(function (d){
        d.Age = parseFloat(d.Age);
        d.Height = parseFloat(d.Height);
        d.Weight = parseFloat(d.Weight);
        d["Right leg length"] = parseFloat(d["Right leg length"])
        d["Left leg length"] = parseFloat(d["Left leg length"])
        d.Gender = parseFloat(d["Gender(0-woman 1-man)"])
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
    filterData(18, 62, -1,-1,-1,75,-1,1,2,[]);
}

async function filterData(ageLower = -1, ageUpper = -1, heightLower = -1, heightUpper = -1, weightLower =-1, weightUpper = -1,
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

    for (let i =0 ; i< filterDemo.length; i++){
        if(speed == -1)
            speed = 1;
        if(trial == -1)
            trial = 1;

        link = baseLink + filterDemo[i].ID + "_" + speed + "_" + trial +".csv";
        await d3.csv(link, function (d) {
            filterMarkers.push(d);
        });
    }
    updateSpeed(speed);
    updateTrial(trial);
    load3DView();

}

loadDemoData();
