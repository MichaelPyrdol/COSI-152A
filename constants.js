const rowsPerBeat = 8; // 8 Integer only
const measureCount = 5; // 5 Integer only
const beatsPerMeasure = 4; // 4
const tempo = 200; // 120
const noteHeight = 2; // 2

const numRows = rowsPerBeat * measureCount * beatsPerMeasure; // 170
const delay = 60000 / tempo / rowsPerBeat;

function playSound() {
    move.currentTime = 0;
    move.play();
}

let hoverRows=[];