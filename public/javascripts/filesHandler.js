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
    //console.log(sceneMaker.filterMarkers);
    sceneMaker.filterMarkers.forEach(function (d) {
        console.log(d);
    })

});


