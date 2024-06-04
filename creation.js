// document.body.addEventListener('click', function () {
//     prepareAudio();
// }, { once: true });
function prepareAudio() {
    var isSafari = window.safari !== undefined;
    if (isSafari) {
        alert("Opti-MIDI is not compatible with Safari due to audio playback restrictions. We apologize for the inconvenience. Please try another browser.<br><br>-Michael");
    } else {
        audioBox = document.getElementById("audioBox");
        let output = "";
        for (let i = 1; i <= 88; i++) {
            output += "<audio id='note_" + i + "' src='sfx/" + i + ".ogg'></audio>"
        }
        audioBox.innerHTML = output;
        for (let i = 1; i <= 88; i++) {
            keyAudio[i] = document.getElementById("note_" + i);
            keyAudio[i].volume = 0.2;
        }
    }
}
function generateGrid() {
    grid.innerHTML = createGrid();
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
    grid.addEventListener("click", processClick);
    grid.addEventListener("mousedown", drag);
    grid.addEventListener("mouseleave", unhover);

    let rows = grid.getElementsByTagName("tr");
    let del = 1600 / rowsPerBeat / beatsPerMeasure / measureCount;
    for (let i = 0; i < numRows; i++) {
        setTimeout(() => {
            rows[i].style.display = "table-row";
        }, del * i);
    }
    preparePiano();
    let titleScreeny = document.getElementById("titleScreen");
    titleScreeny.remove();
    titleScreen=false;
}
function preparePiano() {
    piano.innerHTML = createPiano();
    piano.addEventListener("mouseleave", refreshKeys);
    for (let j = 1; j <= 88; j++) {
        let topKey = document.getElementById(numRows + 1 + "-" + j);
        topKey.classList.add("topKey");
        topKey.addEventListener("mouseover", function () {
            highlightKey(topKey);
        });
        let bottomKey = document.getElementById(numRows + 2 + "-" + j);
        bottomKey.classList.add("bottomKey");
        if (bottomKey.classList.contains("white")) {
            bottomKey.addEventListener("mouseover", function () {
                highlightKey(topKey);
            });
        } else {
            bottomKey.addEventListener("mouseover", function () {
                refreshKeys();
            });
        }
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
}
function showTitleScreen() {
    prepareAudio();
    gridPreview.innerHTML = createGridPreview();
    pianoPreview.innerHTML = createPianoPreview();
    for (let j = 1; j <= 12; j++) {
        let topKey = document.getElementById(-1 + "-" + j);
        topKey.classList.add("topKey");
        let bottomKey = document.getElementById(-2 + "-" + j);
        bottomKey.classList.add("bottomKey");
    }
    for (let i = -2; i <= -1; i++) {
        let whiteLeftTop = document.getElementById(i + "-" + 5);
        whiteLeftTop.classList.add("whiteLeft");
        let whiteLeftBottom = document.getElementById(i + "-" + 5);
        whiteLeftBottom.classList.add("whiteLeft");
        let whiteLeftTop2 = document.getElementById(i + "-" + 12);
        whiteLeftTop2.classList.add("whiteLeft");
        let whiteLeftBottom2 = document.getElementById(i + "-" + 12);
        whiteLeftBottom2.classList.add("whiteLeft");
    }
    let bFlat = document.getElementById(-2 + "-" + 11);
    bFlat.classList.add("bFlat");
    let cSharp = document.getElementById(-2 + "-" + 2);
    cSharp.classList.add("cSharp");
    let dSharp = document.getElementById(-2 + "-" + 4);
    dSharp.classList.add("dSharp");
    let fSharp = document.getElementById(-2 + "-" + 7);
    fSharp.classList.add("fSharp");
    updatePreviewTicks();
}
function createGrid() {
    let output = "";
    for (let i = 1; i <= numRows; i++) {
        output += "<tr style='display:none'>" + create88(i) + "</tr>";
    }
    return output;
}
function createPiano() {
    let output = "";
    output += "<tr>" + create88(numRows + 1) + "</tr>";
    output += "<tr>" + create88(numRows + 2) + "</tr>";
    return output;
}
function createGridPreview() {
    let output = "";
    for (let i = 0; i < rowsPerBeat * beatsPerMeasure * measureCount; i++) {
        output += `<tr>`;
        output += octave(-3 - i, 0);
        output += `</tr>`;
    }
    return output;
}
function updateGridPreview(elem) {
    const variables = [unitsPerRow, rowsPerBeat, beatsPerMeasure, measureCount];
    const variableNames = ["unitsPerRow", "rowsPerBeat", "beatsPerMeasure", "measureCount"];
    variableNames.forEach((name, index) => {
        const box = document.getElementById(name + "Box");
        const slider = document.getElementById(name + "Slider");
        if (elem === "slider") {
            variables[index] = slider.value;
            box.value = slider.value;
        } else {
            variables[index] = box.value;
            slider.value = box.value;
        }
    });
    [unitsPerRow, rowsPerBeat, beatsPerMeasure, measureCount] = variables.map(Number);
    unitsPerRow /= 10;
    gridPreview.innerHTML = createGridPreview();
    unitsPerRowSlider.max = Math.round(1000 / rowsPerBeat / beatsPerMeasure / measureCount);
    delay = 60000 / tempo / rowsPerBeat;
    numRows = rowsPerBeat * measureCount * beatsPerMeasure;
    updatePreviewTicks();
}
function updatePreviewTicks() {
    for (let i = -2 - rowsPerBeat; i > -2 - rowsPerBeat * beatsPerMeasure * measureCount; i -= rowsPerBeat) {
        for (let j = 1; j <= 12; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("beatTick");
        }
    }
    for (let i = -2 - rowsPerBeat * beatsPerMeasure * measureCount; i < -2; i += rowsPerBeat * beatsPerMeasure) {
        for (let j = 1; j <= 12; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("measureTick");
        }
    }
    for (let i = -2 - rowsPerBeat * beatsPerMeasure * measureCount; i < -2; i++) {
        if (i % 2 == 0) {
            let row = document.getElementById(i + "-" + 1);
            row.classList.add("whiteNote");
        } else {
            let row = document.getElementById(i + "-" + 1);
            row.classList.add("blackNote");
        }
    }
}
function createPianoPreview() {
    let output = "";
    output += `<tr>`;
    output += octave(-1, 0);
    output += `</tr><tr>`;
    output += octave(-2, 0);
    output += `</tr>`;
    return output;
}
function create88(i) {
    let output = "";
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
    let output = `<td
        id="${i}-${j}"
        class='${color}'
        onmouseover="hover(${i},${j})"
        style="height:${unitsPerRow}px">
        </td>`
    return output;
}