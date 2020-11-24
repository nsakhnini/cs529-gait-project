import * as sceneMaker from './mainSceneMaker.js';
import {updateScene} from "./mainSceneMaker.js";

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    console.log("test");
    if (this.readyState == 4) {
        if (this.responseText != "error") {
            console.log(this.responseText);
        }
    }
}

//Save png files
document.getElementById("save-png-button").addEventListener("click", function () {
    html2canvas(document.querySelector("body")).then(canvas => {
        canvas.toBlob(function(blob) {
            saveAs(blob, "gaits_" + getCurrentDateString() + ".png");
        });
    });
    sceneMaker.save3DSceneView(getCurrentDateString());
});

//Save csv files
document.getElementById("save-csv-btn").addEventListener("click", function () {
    let header = ""
    let headerFlag = false;
    let rows = ""
    sceneMaker.filterMarkers.forEach(function (d) {
        d.forEach(function (n){
            rows += Object.keys(n).map(function(q){
                if(!headerFlag) {
                    if (q !== "R_HM5_Z") {
                        header += q + ",";
                    }
                    else {
                        header += q;
                        headerFlag = true;
                    }
                }
                return n[q];
            }).join(',') + "\r\n";
        });
    });

    let csvContent = "data:text/csv;charset=utf-8," + header+ '\r\n' + rows;
    let encodedUri = encodeURI(csvContent);

    var csvFile = document.createElement("a");
    csvFile.setAttribute("href", encodedUri);
    csvFile.setAttribute("download", "selected_gait_data_" + getCurrentDateString() + ".csv");
    document.body.appendChild(csvFile);
    csvFile.click();


    //Demographics file

    header = "";
    headerFlag = false;
    rows = "";

    sceneMaker.filterDemo.forEach(function (n) {
            rows += Object.keys(n).map(function(q){
                if(!headerFlag) {
                    if (q !== "Left_leg_length") {
                        header += q + ",";
                    }
                    else {
                        header += q;
                        headerFlag = true;
                    }
                }
                return n[q];
            }).join(',') + "\r\n";
    });

    csvContent = "data:text/csv;charset=utf-8," + header +'\r\n' + rows;
    encodedUri = encodeURI(csvContent);

    csvFile.setAttribute("href", encodedUri);
    csvFile.setAttribute("download", "selected_demographic_data_" + getCurrentDateString() + ".csv");
    document.body.appendChild(csvFile);
    csvFile.click();
});

//Save custom settings
//Add camera settings and participant selected
document.getElementById("save-work-btn").addEventListener("click", function () {
    let valuesUpper = document.getElementsByClassName("valueUpper");
    let valuesLower = document.getElementsByClassName("valueLower");
    let results = {filters: {
            age: {
                lowerValue: "",
                upperValue: ""
            },
            height: {
                lowerValue: "",
                upperValue: ""
            },
            weight: {
                lowerValue: "",
                upperValue: ""
            },
            gender: {
                isFemale: "",
                isMale: ""
            },
            selectedParticipant: {
                id: ""
            },
            speed: "",
            trial: ""
        }, cameraSettings: {
        //TBD later
        }};
    for (let i=0; i<valuesUpper.length; i++ ){
        switch (valuesUpper[i].parentElement.parentElement.parentElement.id) {
            case "slider-age":
                results.filters.age.lowerValue = valuesLower[i].innerText;
                results.filters.age.upperValue = valuesUpper[i].innerText;
                break;
            case "slider-height":
                results.filters.height.lowerValue = valuesLower[i].innerText;
                results.filters.height.upperValue = valuesUpper[i].innerText;
                break;
            case "slider-weight":
                results.filters.weight.lowerValue = valuesLower[i].innerText;
                results.filters.weight.upperValue = valuesUpper[i].innerText;
                break;
            default: ;
        }
        results.filters.speed = sceneMaker.speed;
        results.filters.trial = sceneMaker.trial;
        results.filters.gender.isFemale =  document.getElementById("female-check").checked;
        results.filters.gender.isMale =  document.getElementById("male-check").checked;
    }

    let jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results));
    var jsonFile = document.createElement("a");
    jsonFile.setAttribute("href", jsonContent);
    jsonFile.setAttribute("download", "gait_exploration_"+getCurrentDateString() + ".json");
    jsonFile.click();
});

function getCurrentDateString(){
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();

    let strDate = month + "_" + day + "_" + year;
    return strDate;
}

document.getElementById("upload-submit").addEventListener("click", function () {
    var xhttp = new XMLHttpRequest();
    let valuesUpper = document.getElementsByClassName("valueUpper");
    let valuesLower = document.getElementsByClassName("valueLower");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.responseText != "error") {
                var results = JSON.parse(this.responseText);
                console.log(results);
                for (let i=0; i<valuesUpper.length; i++ ){
                    switch (valuesUpper[i].parentElement.parentElement.parentElement.id) {
                        case "slider-age":
                            valuesLower[i].innerText = results.filters.age.lowerValue ;
                            valuesUpper[i].innerText = results.filters.age.upperValue ;
                            sliderLowerHandleController(document.getElementsByClassName("age-slider-input")[0]);
                            sliderUpperHandleController(document.getElementsByClassName("age-slider-input")[1]);
                            break;
                        case "slider-height":
                            valuesLower[i].innerText = results.filters.height.lowerValue ;
                            valuesUpper[i].innerText = results.filters.height.upperValue ;
                            sliderLowerHandleController(document.getElementsByClassName("height-slider-input")[0]);
                            sliderUpperHandleController(document.getElementsByClassName("height-slider-input")[1]);
                            break;
                        case "slider-weight":
                            valuesLower[i].innerText = results.filters.weight.lowerValue ;
                            valuesUpper[i].innerText = results.filters.weight.upperValue ;
                            sliderLowerHandleController(document.getElementsByClassName("weight-slider-input")[0]);
                            sliderUpperHandleController(document.getElementsByClassName("weight-slider-input")[1]);
                            break;
                        default: ;
                    }
                    sceneMaker.updateSpeed(results.filters.speed) ;
                    sceneMaker.updateTrial(results.filters.trial) ;
                    document.getElementById("female-check").checked = results.filters.gender.isFemale;
                    document.getElementById("male-check").checked = results.filters.gender.isMale;

                    updateScene();
                }
            }
        }
    }
    xhttp.open("POST", "/uploadfile", true);
    let formData = new FormData();
    formData.append("savedWork",document.getElementById("upload-input").files[0]);
    xhttp.send(formData);
    document.getElementById("dismiss-btn").click();
});