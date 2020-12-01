import {
    filterDemo,
    offsetY,
    setPOffset,
    drawHumanDots,
    scrollIndex,
    scene,
    participantsData,
    setScrollIndex,
    updateBottomText,
    participantsState,
    emptyParticipantsState,
    currentParticipantsData,
    emptyCurrentParticipantsData
} from "./mainSceneMaker.js";

let delCounter = 0;

export function activateScrolling() {
    document.getElementById("scroll-down-btn").disabled = false;
    document.getElementById("scroll-down-btn-readonly").disabled = false;
    document.getElementById("scroll-up-btn").disabled = false;
    document.getElementById("scroll-up-btn-readonly").disabled = false;
}

export function deactivateScrolling(){
        document.getElementById("scroll-down-btn").disabled = true;
        document.getElementById("scroll-down-btn-readonly").disabled = true;
        document.getElementById("scroll-up-btn").disabled = true;
        document.getElementById("scroll-up-btn-readonly").disabled = true;
}
export function scrollDown(){
    //If not minimum
    if(scrollIndex >= 6) {
        emptyParticipantsState();
        emptyCurrentParticipantsData();
        //Remove current participants
        setPOffset(-3500);
        delCounter = 0;
        while(scene.children.length > delCounter ){
            if(typeof scene.children[delCounter].userData.id !== 'undefined' || typeof scene.children[delCounter].userData.isbbox !== 'undefined')
                scene.remove(scene.children[delCounter]);
            else{
                delCounter += 1;
            }
        }
        if(scrollIndex == filterDemo.length) {
            setScrollIndex(filterDemo.length - filterDemo.length % 6);
        }

        setScrollIndex(scrollIndex - 6);
        updateBottomText(scrollIndex, scrollIndex + 6);

        for (let i = scrollIndex; i < scrollIndex + 6; i++) {
            drawHumanDots(participantsData[i][0], offsetY);
            setPOffset(offsetY + 1200);
            currentParticipantsData.push(participantsData[i]);
            participantsState.push(1); //1 is ready to move
        }

        if (scrollIndex <= 0) {
            document.getElementById("scroll-down-btn").disabled = true;
            document.getElementById("scroll-down-btn-readonly").disabled = true;
        }

    }
    //Activate up btn if was max
    if (scrollIndex < (filterDemo.length - filterDemo.length%6)) {
        document.getElementById("scroll-up-btn").disabled = false;
        document.getElementById("scroll-up-btn-readonly").disabled = false;
    }

}
var difference;
export function scrollUp(){
    emptyParticipantsState();
    emptyCurrentParticipantsData();
    //If not maximum
    setPOffset(-3500);
    if(scrollIndex < filterDemo.length) {
        //Remove current participants
        delCounter = 0;
        while(scene.children.length > delCounter ){
            if(typeof scene.children[delCounter].userData.id !== 'undefined' || typeof scene.children[delCounter].userData.isbbox !== 'undefined')
                scene.remove(scene.children[delCounter]);
            else{
                delCounter += 1;
            }
        }

        if(scrollIndex == (filterDemo.length - filterDemo.length%6))
            difference = filterDemo.length%6;
        else
            difference = 6;

        for (let i = scrollIndex; i < scrollIndex + difference; i++) {
            drawHumanDots(participantsData[i][0], offsetY);
            setPOffset(offsetY + 1200);
            currentParticipantsData.push(participantsData[i]);
            participantsState.push(1); //1 is ready to move
        }

        updateBottomText(scrollIndex, scrollIndex + difference);

        if(scrollIndex+difference < filterDemo.length-1)
            setScrollIndex(scrollIndex + 6);
        else{
            setScrollIndex(filterDemo.length);
            document.getElementById("scroll-up-btn").disabled = true;
            document.getElementById("scroll-up-btn-readonly").disabled = true;
        }
    }
    if(scrollIndex >= 6){
        document.getElementById("scroll-down-btn").disabled = false;
        document.getElementById("scroll-down-btn-readonly").disabled = false;
    }
}