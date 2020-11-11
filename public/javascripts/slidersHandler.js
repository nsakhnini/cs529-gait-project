function sliderLowerHandleController(val){
    val.value=Math.min(val.value,val.parentNode.childNodes[5].value-1);
    var value=(100/(parseInt(val.max)-parseInt(val.min)))*parseInt(val.value)-(100/(parseInt(val.max)-parseInt(val.min)))*parseInt(val.min);
    var children = val.parentNode.childNodes[1].childNodes;
    children[1].style.width=value+'%';
    children[5].style.left=value+'%';
    children[7].style.left=value+'%';children[11].style.left=value+'%';
    children[11].childNodes[1].innerHTML=val.value;
}
function sliderUpperHandleController(val){
    val.value=Math.max(val.value,val.parentNode.childNodes[3].value-(-1));
    var value = (100/(parseInt(val.max)-parseInt(val.min)))*parseInt(val.value)-(100/(parseInt(val.max)-parseInt(val.min)))*parseInt(val.min);
    var children = val.parentNode.childNodes[1].childNodes;
    children[3].style.width=(100-value)+'%';
    children[5].style.right=(100-value)+'%';
    children[9].style.left=value+'%';children[13].style.left=value+'%';
    children[13].childNodes[1].innerHTML=val.value;
}

