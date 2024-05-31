function playSound(key,noteDuration) {
    let deloy=200;
    if(noteDuration!=undefined){
        let unitDuration=60000 / (tempo * rowsPerBeat*2);
        deloy=noteDuration*unitDuration*2;
    }
    notey[key].play();
    setTimeout(() => {
        notey[key].currentTime = notey[key].duration;
    }, deloy);
}
function changeTempo(elem) {
    let tempoSlider = document.getElementById("tempoSlider");
    let tempoBox = document.getElementById("tempoBox");
    if (elem == "slider") {
        let newTempo = tempoSlider.value;
        tempo = newTempo;
        tempoBox.value = newTempo;
    } else {
        let newTempo = tempoBox.value;
        tempo = newTempo;
        tempoSlider.value = newTempo;
    }
    delay = 60000 / tempo / rowsPerBeat;
}
function finishSlide() {
    if (!paused) {
        playPause();
        playPause();
    }
}
function clearNotes() {
    noteRows.forEach(row => {
        row.removeAttribute("data-parent");
        row.classList.remove("note");
    })
    noteRows = [];
    deselect();
}
const contextMenu = document.getElementById('custom-context-menu');

function showContextMenu(event) {
    if(fromBeginning){
        if(hoverRows[0].classList.contains("note")){
            deselect();
            contextMenuShow=true;
            event.preventDefault();
        
            const menuWidth = contextMenu.offsetWidth;
            const menuHeight = contextMenu.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
        
            let posX = event.pageX;
            let posY = event.pageY;
        
            if (posX + menuWidth > windowWidth) {
                posX = windowWidth - menuWidth;
            }
            if (posY + menuHeight > windowHeight) {
                posY = windowHeight - menuHeight;
            }
        
            contextMenu.style.left = `${posX}px`;
            contextMenu.style.top = `${posY}px`;
            contextMenu.style.display = 'block';
        }
    }
}
function hideContextMenu() {
    contextMenuShow=false;
    contextMenu.style.display = 'none';
}
document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});