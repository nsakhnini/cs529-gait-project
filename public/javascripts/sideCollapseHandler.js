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
            camera.aspect = 10 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(10 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        //TODO: Remove filter bar content and short hand
    } else {
        document.getElementById("filter-sidebar").style.maxWidth = window.innerWidth / 4 + "px";
        document.getElementsByClassName("filter-toggle-btn")[0].innerText = "<";
        isFilterToggled = false;

        //resize main scene
        if(is2DToggled) {
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 6 * (window.innerWidth / 12) + "px";
            camera.aspect = 6 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(6 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }

        //TODO: Remove short hand and add filter bar content
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
            camera.aspect = 10 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(10 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 8 * (window.innerWidth / 12) + "px";
            camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
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
            camera.aspect = 8 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(8 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        else{
            document.getElementById("scene-section").style.maxWidth = 6 * (window.innerWidth / 12) + "px";
            camera.aspect = 6 * (window.innerWidth / 12) / (window.innerHeight * 0.9);
            camera.updateProjectionMatrix();
            renderer.setSize(6 * (window.innerWidth / 12), window.innerHeight * 0.9);
        }
        //TODO: Remove short hand and add filter bar content
    }

}