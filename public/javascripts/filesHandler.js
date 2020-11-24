import * as sceneMaker from './mainSceneMaker.js';

//Save png files
document.getElementById("save-png-button").addEventListener("click", function () {
    html2canvas(document.querySelector("body")).then(canvas => {
        canvas.toBlob(function(blob) {
            saveAs(blob, "gaits.png");
        });
    });
    sceneMaker.save3DSceneView();
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
    csvFile.setAttribute("download", "selected_gait_data.csv");
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
    csvFile.setAttribute("download", "selected_demographic_data.csv");
    document.body.appendChild(csvFile);
    csvFile.click();
});


