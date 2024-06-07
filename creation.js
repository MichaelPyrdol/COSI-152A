function prepareAudio() {
    var isSafari = window.safari !== undefined;
    if (isSafari) {
        alert("Opti-MIDI is not compatible with Safari due to audio playback restrictions. We apologize for the inconvenience. Please try another browser.<br><br>-Michael");
    } else {
        for (let i = 1; i <= 88; i++) {
            keyAudio[i] = new Audio(`sfx/${i}.ogg`);
            keyAudio[i].preload="auto";
            keyAudio[i].volume = 0.2;
        }
    }
}
function generateGrid() {
    grid.innerHTML = createGrid();
    for (let i = numRows; i > 0; i -= rowsPerBeat * beatsPerMeasure) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("measureTick");
        }
    }
    for (let i = numRows - rowsPerBeat; i > 0; i -= rowsPerBeat) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("beatTick");
        }
    }
    let measureNumber = 1;
    for (let i = numRows; i > 0; i -= rowsPerBeat * beatsPerMeasure) {
        let beat = document.getElementById(i + "-1");
        markerRows.push(beat);
        beat.classList.add("markerContainer");
        beat.innerHTML = "<span class='marker'>" + measureNumber + "</span>";
        measureNumber++;
    }
    for (let j = 1; j <= 88; j++) {
        let beat = document.getElementById("1-" + j);
        markerRows.push(beat);
        beat.classList.add("markerContainer");
    }
    gridAnimation();
}
function gridAnimation() {
    grid.addEventListener("click", processClick);
    grid.addEventListener("mousedown", drag);
    grid.addEventListener("mouseleave", unhover);
    piano.addEventListener("click", playSelected);

    // Piano intro animation
    let del = 1600 / rowsPerBeat / beatsPerMeasure / measureCount;
    let rows = grid.getElementsByTagName("tr");
    for (let i = 0; i < numRows; i++) {
        setTimeout(() => {
            rows[i].removeAttribute("style");
        }, del * i);
    }
    preparePiano();
    controls.removeAttribute("style");
    let titleScreeny = document.getElementById("titleScreen");
    titleScreeny.remove();
    titleScreen = false;
}
function preparePiano() {
    piano.innerHTML = createPiano();
    piano.addEventListener("mouseleave", refreshKeys);
    for (let i = 1; i <= numRows + 2; i++) {
        for (let j = 3; j < 88; j += 12) {
            let wLeftTop = document.getElementById(i + "-" + j);
            wLeftTop.classList.add("wLeft");
            let wLeftBottom = document.getElementById(i + "-" + j);
            wLeftBottom.classList.add("wLeft");
        }
        for (let j = 8; j < 88; j += 12) {
            let wLeftTop = document.getElementById(i + "-" + j);
            wLeftTop.classList.add("wLeft");
            let wLeftBottom = document.getElementById(i + "-" + j);
            wLeftBottom.classList.add("wLeft");
        }
    }
    for (let j = 1; j <= 88; j++) {
        let topKey = document.getElementById(numRows + 1 + "-" + j);
        topKey.id = "top-" + j;
        topKey.classList.add("topKey");
        let bottomKey = document.getElementById(numRows + 2 + "-" + j);
        bottomKey.id = "bottom-" + j;
        bottomKey.classList.add("bottomKey");
    }
    for (let j = 2; j < 88; j += 12) {
        let bFlat = document.getElementById("bottom-" + j);
        bFlat.classList.add("bFlat");
    }
    for (let j = 5; j < 88; j += 12) {
        let bFlat = document.getElementById("bottom-" + j);
        bFlat.classList.add("cSharp");
    }
    for (let j = 7; j < 88; j += 12) {
        let bFlat = document.getElementById("bottom-" + j);
        bFlat.classList.add("dSharp");
    }
    for (let j = 10; j < 88; j += 12) {
        let bFlat = document.getElementById("bottom-" + j);
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
        let wLeftTop = document.getElementById(i + "-" + 5);
        wLeftTop.classList.add("wLeft");
        let wLeftBottom = document.getElementById(i + "-" + 5);
        wLeftBottom.classList.add("wLeft");
        let wLeftTop2 = document.getElementById(i + "-" + 12);
        wLeftTop2.classList.add("wLeft");
        let wLeftBottom2 = document.getElementById(i + "-" + 12);
        wLeftBottom2.classList.add("wLeft");
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
    document.documentElement.style.setProperty('--row', unitsPerRow + "px");
    defaultNoteDuration = rowsPerBeat;
    gridPreview.innerHTML = createGridPreview();
    unitsPerRowSlider.max = Math.round(1000 / rowsPerBeat / beatsPerMeasure / measureCount);
    setDelay();
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
            row.classList.add("wNote");
        } else {
            let row = document.getElementById(i + "-" + 1);
            row.classList.add("bNote");
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
    output += note(i, 1, "w");
    output += note(i, 2, "b");
    output += note(i, 3, "w");
    for (let j = 0; j < 7; j++) {
        output += octave(i, j * 12 + 3);
    }
    output += note(i, 88, "w");
    output += `</tr>`;
    return output;
}
function octave(i, j) {
    let output = "";
    output += note(i, j + 1, "w");
    output += note(i, j + 2, "b");
    output += note(i, j + 3, "w");
    output += note(i, j + 4, "b");
    output += note(i, j + 5, "w");
    output += note(i, j + 6, "w");
    output += note(i, j + 7, "b");
    output += note(i, j + 8, "w");
    output += note(i, j + 9, "b");
    output += note(i, j + 10, "w");
    output += note(i, j + 11, "b");
    output += note(i, j + 12, "w");
    return output;
}
function note(i, j, color) {
    let output = `<td
        id="${i}-${j}"
        class='${color}'
        onmouseover="hover(${i},${j})">
        </td>`
    return output;
}