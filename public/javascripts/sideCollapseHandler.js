var isFilterToggled = false;
var is2DToggled = false;

function toggleFilterBar() {
    if(!isFilterToggled){
        document.getElementById("filter-sidebar").style.maxWidth = window.innerWidth/9 + "px";
        document.getElementsByClassName("filter-toggle-btn")[0].innerText = ">";
        isFilterToggled = true;
        //TODO: Resize 3D main view
        //TODO: Remove filter bar content and short hand
    }
    else {
        document.getElementById("filter-sidebar").style.maxWidth = window.innerWidth/3 + "px";
        document.getElementsByClassName("filter-toggle-btn")[0].innerText = "<";
        isFilterToggled = false;
        //TODO: Resize 3D main view
        //TODO: Remove short hand and add filter bar content
    }

}

function toggle2DBar() {
    if(!is2DToggled){
        document.getElementById("two-d-sidebar").style.maxWidth = window.innerWidth/9 + "px";
        document.getElementsByClassName("two-d-toggle-btn")[0].innerText = "<";
        is2DToggled = true;
        //TODO: Resize 3D main view
        //TODO: Remove filter bar content and short hand
    }
    else {
        document.getElementById("two-d-sidebar").style.maxWidth = window.innerWidth/3 + "px";
        document.getElementsByClassName("two-d-toggle-btn")[0].innerText = ">";
        is2DToggled = false;
        //TODO: Resize 3D main view
        //TODO: Remove short hand and add filter bar content
    }

}