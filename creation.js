// document.body.addEventListener('click', function () {
//     prepareAudio();
// }, { once: true });
function prepareAudio() {
    var isSafari = window.safari !== undefined;
    if (isSafari) {
        alert("Opti-MIDI is not compatible with Safari due to audio playback restrictions. Sorry for the inconvenience. Please try another browser.");
    }else{
        audioBox = document.getElementById("audioBox");
        let output = "";
        for (let i = 1; i <= 88; i++) {
            output += "<audio id='note_" + i + "' src='sfx/" + i + ".mp3' preload='metadata'></audio>"
        }
        audioBox.innerHTML = output;
        for (let i = 1; i <= 88; i++) {
            notey[i] = document.getElementById("note_" + i);
            notey[i].volume = 0.1;
        }
    }
}
function populate() {
    let grid = document.getElementById("grid");
    grid.innerHTML = createGrid();
    piano.innerHTML = createPiano();
    let tempoBox = document.getElementById("tempo");
    tempoBox.value = tempo;
    for (let j = 1; j <= 88; j++) {
        let topKey = document.getElementById(numRows + 1 + "-" + j);
        topKey.classList.add("topKey");
        let bottomKey = document.getElementById(numRows + 2 + "-" + j);
        bottomKey.classList.add("bottomKey");
    }
    for (let i = 1; i <= numRows + 2; i++) {
        for (let j = 3; j < 88; j += 12) {
            let whiteLeftTop = document.getElementById(i + "-" + j);
            whiteLeftTop.classList.add("whiteLeft");
            let whiteLeftBottom = document.getElementById(i + "-" + j);
            whiteLeftBottom.classList.add("whiteLeft");
        }
        for (let j = 8; j < 88; j += 12) {
            let whiteLeftTop = document.getElementById(i + "-" + j);
            whiteLeftTop.classList.add("whiteLeft");
            let whiteLeftBottom = document.getElementById(i + "-" + j);
            whiteLeftBottom.classList.add("whiteLeft");
        }
    }
    for (let j = 2; j < 88; j += 12) {
        let bFlat = document.getElementById(numRows + 2 + "-" + j);
        bFlat.classList.add("bFlat");
    }
    for (let j = 5; j < 88; j += 12) {
        let bFlat = document.getElementById(numRows + 2 + "-" + j);
        bFlat.classList.add("cSharp");
    }
    for (let j = 7; j < 88; j += 12) {
        let bFlat = document.getElementById(numRows + 2 + "-" + j);
        bFlat.classList.add("dSharp");
    }
    for (let j = 10; j < 88; j += 12) {
        let bFlat = document.getElementById(numRows + 2 + "-" + j);
        bFlat.classList.add("fSharp");
    }
    let measureNumber = 1;
    for (let i = numRows; i > 0; i -= rowsPerBeat * beatsPerMeasure) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("measureTick");
        }
        let beat = document.getElementById(i + "-1");
        markerRows.push(beat);
        beat.classList.add("markerContainer");
        beat.innerHTML = "<span class='marker'>" + measureNumber + "</span>";
        measureNumber++;
    }
    for (let i = numRows - rowsPerBeat; i > 0; i -= rowsPerBeat) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("beatTick");
        }
    }
    prepareAudio();
}
function createGrid() {
    let output = "";
    for (let i = 1; i <= numRows; i++) {
        output += create88(i);
    }
    return output;
}
function createPiano() {
    let output = "";
    output += create88(numRows + 1);
    output += create88(numRows + 2);
    return output;
}
function create88(i) {
    let output = "";
    output += `<tr>`;
    output += note(i, 1, "white");
    output += note(i, 2, "black");
    output += note(i, 3, "white");
    for (let j = 0; j < 7; j++) {
        output += octave(i, j * 12 + 3);
    }
    output += note(i, 88, "white");
    output += `</tr>`;
    return output;
}
function octave(i, j) {
    let output = "";
    output += note(i, j + 1, "white");
    output += note(i, j + 2, "black");
    output += note(i, j + 3, "white");
    output += note(i, j + 4, "black");
    output += note(i, j + 5, "white");
    output += note(i, j + 6, "white");
    output += note(i, j + 7, "black");
    output += note(i, j + 8, "white");
    output += note(i, j + 9, "black");
    output += note(i, j + 10, "white");
    output += note(i, j + 11, "black");
    output += note(i, j + 12, "white");
    return output;
}
function note(i, j, color) {
    let output = `<td id="${i}-${j}" class='${color}' onmouseover="hover(${i},${j})" onclick="processNote(${i},${j});" style="height:${rowHeight}px"></td>`
    return output;
}