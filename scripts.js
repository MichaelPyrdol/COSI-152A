function playSound(key, noteDuration) {
    let audioDelay = 200;
    if (noteDuration != undefined) {
        let unitDuration = 60000 / (tempo * rowsPerBeat * 2.1);
        audioDelay = noteDuration * unitDuration * 2;
    }
    keyAudio[key].play();
    setTimeout(() => {
        keyAudio[key].currentTime = keyAudio[key].duration;
    }, audioDelay);
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
    notes.forEach(note => {
        note.forEach(row => {
            row.removeAttribute("data-parent");
            row.classList.remove("note");
        })
    })
    noteSnapshot = [];
    notes = [];
    deselect();
    refreshKeys();
}
function downloadFile(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "file.opti-midi";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function save() {
    reset();
    deselect();
    let newFileContents = "unitsPerRow:" + unitsPerRow + "|rowsPerBeat:" + rowsPerBeat + "|beatsPerMeasure:" + beatsPerMeasure + "|measureCount:" + measureCount + "|tempo:" + tempo + "|[";
    notes.forEach(note => {
        newFileContents += "[";
        note.forEach(row => {
            newFileContents += row.id + ","
        })
        newFileContents = newFileContents.slice(0, -1) + "],";
    })
    newFileContents = newFileContents.slice(0, -1) + "]|[";
    markerRows.forEach(row => {
        newFileContents += row.id + ","
    })
    newFileContents = newFileContents.slice(0, -1) + "]|" + grid.innerHTML;
    downloadFile(newFileContents);
}
function load() {
    notes = [];
    markerRows.forEach(row => {
        row.classList.remove("markerContainer")
        row.innerHTML = "<span class=''>a</span>";
    })
    markerRows = [];
    splitFile = fileContents.split("|");
    unitsPerRow = parseInt(splitFile[0].split("unitsPerRow:")[1]);
    rowsPerBeat = parseInt(splitFile[1].split("rowsPerBeat:")[1]);
    beatsPerMeasure = parseInt(splitFile[2].split("beatsPerMeasure:")[1]);
    measureCount = parseInt(splitFile[3].split("measureCount:")[1]);
    tempo = parseInt(splitFile[4].split("tempo:")[1]);
    document.documentElement.style.setProperty('--row', unitsPerRow + "px");
    tempoBox.value = tempo;
    tempoSlider.value = tempo;
    setDelay();
    numRows = rowsPerBeat * measureCount * beatsPerMeasure;
    grid.innerHTML = splitFile[7];
    let savedNotes = splitFile[5].split("[");
    savedNotes.forEach(note => {
        if (note != "") {
            let noteRows = note.split("]")[0].split(",");
            tempNotey = [];
            noteRows.forEach(row => {
                tempNotey.push(document.getElementById(row));
            });
            notes.push(tempNotey);
        }
    })
    let savedMarkers = splitFile[6].split("[")[1].split("]")[0].split(",");
    savedMarkers.forEach(marker => {
        markerRows.push(document.getElementById(marker))
    })
    let rows = grid.getElementsByTagName("tr");
    for (let i = 0; i < numRows; i++) {
        rows[i].setAttribute("style", "display:none");
    }
    gridAnimation();
}
function setDelay() {
    delay = 60000 / tempo / rowsPerBeat;
}
let fileName = "";
let fileContents = "";
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    fileName = "";
    fileContents = "";

    reader.onload = function (e) {
        fileName += file.name;
        if (fileName.includes(".opti-midi")) {
            fileContents += e.target.result;
            load();
        }
        else {
            tabStuff.innerHTML = "Wrong file type!";
        }
    };
    reader.readAsText(file);
});
const contextMenu = document.getElementById('custom-context-menu');

function showContextMenu(event) {
    if (fromBeginning && hoverRows != "") {
        if (hoverRows[0].classList.contains("note")) {
            deselect();
            contextMenuShow = true;
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
    contextMenuShow = false;
    contextMenu.style.display = 'none';
}
document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});