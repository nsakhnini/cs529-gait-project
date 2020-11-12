import * as s from "./mainSceneMaker.js"

var isFilterToggled = false;
var is2DToggled = false;

function toggleFilterBar() {
    if (!isFilterToggled) {
        document.getElementById("filter-sidebar").style.maxWidth = window.innerWidth / 12 + "px";
        document.getElementsByClassName("filter-toggle-btn")[0].innerText = ">";
        isFilterToggled = true;

        //resize main scene
        if(is2DToggled) {
            document.getElementById("scene-section").style.maxWidth = 10 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 10 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(10 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        //TODO: Remove filter bar content and short hand
        renderCollapsedPanelView();


    } else {
        document.getElementById("filter-sidebar").style.maxWidth = window.innerWidth / 4 + "px";
        document.getElementsByClassName("filter-toggle-btn")[0].innerText = "<";
        isFilterToggled = false;

        //resize main scene
        if(is2DToggled) {
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 6 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 6 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(6 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }

        //TODO: Remove short hand and add filter bar content
        renderExpandedPanelView();
    }

}

function toggle2DBar() {
    if(!is2DToggled){
        document.getElementById("two-d-sidebar").style.maxWidth = window.innerWidth/12 + "px";
        document.getElementsByClassName("two-d-toggle-btn")[0].innerText = "<";
        is2DToggled = true;
        //resize main scene
        if(isFilterToggled) {
            document.getElementById("scene-section").style.maxWidth = 10 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 10 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(10 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        //TODO: Remove filter bar content and short hand
    }
    else {
        document.getElementById("two-d-sidebar").style.maxWidth = window.innerWidth/4 + "px";
        document.getElementsByClassName("two-d-toggle-btn")[0].innerText = ">";
        is2DToggled = false;
        //resize main scene
        if(isFilterToggled) {
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 6 * (window.innerWidth / 12) + "px";
            s.camera.aspect = 6 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            s.camera.updateProjectionMatrix();
            s.renderer.setSize(6 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        //TODO: Remove short hand and add filter bar content
    }

}
function renderCollapsedPanelView(){
    document.getElementById("participant-list").style.display = "none";
    document.getElementById("slider-age").style.display = "none";
    document.getElementById("slider-height").style.display = "none";
    document.getElementById("slider-weight").style.display = "none";
    document.getElementById("gender-form").style.display = "none";
    document.getElementById("filter-btn").style.visibility = "hidden";

    document.getElementById("participant-list-readyonly").style.display = "block";
    document.getElementById("age-viewonly").style.display = "block";
    document.getElementById("height-readonly").style.display = "block";
    document.getElementById("weight-readonly").style.display = "block";
    document.getElementById("gender-readonly").style.display = "block";
    
}
function renderExpandedPanelView(){
    document.getElementById("participant-list").style.display = "block";
    document.getElementById("slider-age").style.display = "block";
    document.getElementById("slider-height").style.display = "block";
    document.getElementById("slider-weight").style.display = "block";
    document.getElementById("gender-form").style.display = "block";
    document.getElementById("filter-btn").style.visibility = "visible";

    document.getElementById("participant-list-readyonly").style.display = "none";
    document.getElementById("age-viewonly").style.display = "none";
    document.getElementById("height-readonly").style.display = "none";
    document.getElementById("weight-readonly").style.display = "none";
    document.getElementById("gender-readonly").style.display = "none";
}

document.querySelector("#minimize-filter").addEventListener('click', toggleFilterBar);
document.querySelector("#minimize-two-d").addEventListener('click', toggle2DBar);