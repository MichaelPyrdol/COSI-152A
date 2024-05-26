let selectedColumn = 1;
let hoverColumn = 1;
var notey = {};
function populate() {
    let grid = document.getElementById("grid");
    grid.innerHTML = createGrid();
    let measureNumber = 1;
    for (let i = numRows; i > 0; i -= rowsPerBeat * beatsPerMeasure) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("measureTick");
        }
        let beat = document.getElementById(i + "-1");
        beat.innerHTML = "<span class='marker'>" + measureNumber + "</span>";
        measureNumber++;
    }
    for (let i = numRows - rowsPerBeat; i > 0; i -= rowsPerBeat) {
        for (let j = 1; j <= 88; j++) {
            let beat = document.getElementById(i + "-" + j);
            beat.classList.add("beatTick");
        }
    }
    audioBox = document.getElementById("audioBox");
    let output = "";
    for (let i = 1; i <= 88; i++) {
        output += "<audio id='note_" + i + "' src='sfx/" + i + ".ogg'></audio>"
    }
    audioBox.innerHTML = output;
    for (let i = 1; i <= 88; i++) {
        notey[i] = document.getElementById("note_" + i);
    }
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = 0.5;
    });
}
function createGrid() {
    let output = "";
    for (let i = 1; i <= numRows; i++) {
        output += `<tr>`;
        output += note(i, 1, "white");
        output += note(i, 2, "black");
        output += note(i, 3, "white");
        for (let j = 0; j < 7; j++) {
            output += octave(i, j * 12 + 3);
        }
        output += note(i, 88, "white");
        output += `</tr>`;
    }
    return output;
}
populate();

// Placing and selecting notes
function processNote(i, j) {
    hoverNoteID = i + "-" + j;
    let note = document.getElementById(hoverNoteID);
    // Deselecting previous note
    if (!note.classList.contains("selected")) {
        for (let k = 1; k <= numRows; k++) {
            let cell = document.getElementById(k + "-" + selectedColumn);
            cell.classList.remove("selected");
        }
    }
    // Placing a note
    if (!note.classList.contains("note")) {
        // for (let k = i; k > i - rowsPerBeat; k--) {
        //     let otherNote = document.getElementById(k + "-" + j);
        //     otherNote.dataset.parent = (i + "-" + j);
        //     otherNote.classList.add("note");
        //     otherNote.classList.add("selected");
        // }
        let parentID = hoverRows[0].id;
        hoverRows.forEach(row=>{
            row.dataset.parent=parentID;
            row.classList.add("note");
            row.classList.add("selected");
        });
    } else {
        // Selecting a note
        hoverRows.forEach(row=>{
            row.classList.toggle("selected");
        });
    }
    selectedColumn = j;
    notey[j].currentTime = 0;
    notey[j].play();
}
function note(i, j, color) {
    let output = `<td id="${i}-${j}" class='${color}' onmouseover="hover(${i},${j})" onclick="processNote(${i},${j});" style="height:${noteHeight}px"></td>`
    return output;
}
function hover(i, j) {
    if(paused){
        hoverRows.forEach(row=>{
            row.classList.remove("hover");
        });
        hoverRows = [];
        hoverColumn = j;
        let note = document.getElementById(i + "-" + j);
        let k = i;
        while (k < numRows && !note.classList.contains("beatTick")) {
            note = document.getElementById(k + 1 + "-" + j);
            k++;
        }
        let l = k-1;
        if (event.shiftKey && l - rowsPerBeat > 0) {
            while (k > l - rowsPerBeat * 2) {
                hoverRows.push(note);
                note = document.getElementById(k + "-" + j);
                k--;
            }
        } else {
            while (k > l - rowsPerBeat) {
                hoverRows.push(note);
                note = document.getElementById(k + "-" + j);
                k--;
            }
        }
        hoverRows.forEach(row=>{
            row.classList.add("hover");
        });
    }else{
        hoverRows.forEach(row=>{
            row.classList.remove("hover");
        });
        hoverRows = [];
    }
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
const timeouts = [];
let paused = true;
function playPause() {
    toggleVisibility();
    if (paused) {
        paused = false;
        let grid = document.getElementById("grid");
        let rows = grid.rows;
        let rowsLength = 0;
        for (let i = 0; i < rows.length; i++) {
            if (!rows[i].classList.contains("hide")) {
                rowsLength++;
            }
        };
        for (let i = rowsLength - 1; i >= 0; i--) {
            let play = setTimeout(function () {
                for (let j = 1; j < 88; j++) {
                    let beat = document.getElementById(i + 1 + "-" + j);
                    if (beat.classList.contains("note")) {
                        let parentID = beat.dataset.parent;
                        if (beat.id == parentID) {
                            notey[j].currentTime = 0;
                            notey[j].play();
                        }
                        let k = i;
                        while (beat.dataset.parent == parentID) {
                            beat.classList.add("noteHit");
                            beat = document.getElementById(k - 1 + "-" + j);
                            k--;
                        }
                    }
                }
                rows[i].classList.add("hide");
            }, delay * (rowsLength - i), i);
            timeouts.push(play);
        }
    } else {
        stop();
    }
}
function stop() {
    paused = true;
    timeouts.forEach(timeout => clearTimeout(timeout));
}
function reset() {
    stop();
    let grid = document.getElementById("grid");
    let rows = grid.rows;
    for (let i = 1; i < rows.length - 1; i++) {
        rows[i].classList.remove("hide");
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.remove("noteHit");
        }
    };
}
function toggleVisibility() {
    for (let i = 1; i < numRows; i++) {
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.toggle("off");
        }
    }
}
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case ' ':
            playPause();
            break;
        case 'Enter':
            for (let i = 1; i <= numRows; i++) {
                let cell = document.getElementById(i + "-" + selectedColumn);
                if (cell.classList.contains("selected")) {
                    cell.classList.remove("selected");
                }
            }
            break;
        case 'Backspace':
            for (let i = 1; i <= numRows; i++) {
                let cell = document.getElementById(i + "-" + selectedColumn);
                if (cell.classList.contains("selected")) {
                    cell.classList.remove("selected");
                    cell.classList.remove("note");
                    cell.removeAttribute("data-parent");
                }
            }
            break;
        case 'ArrowUp':
            for (let i = 1; i <= numRows; i++) {
                let cell = document.getElementById(i + "-" + selectedColumn);
                if (cell.classList.contains("selected")) {
                    let row = parseInt(cell.id.split("-")[0]);
                    let col = parseInt(cell.id.split("-")[1]);
                    row -= rowsPerBeat;
                    if (row > 0) {
                        newCell = document.getElementById(row + "-" + col);
                        noteMove(cell, newCell);
                    }
                }
            }
            break;
        case 'ArrowDown':
            for (let i = numRows; i >= 1; i--) {
                let cell = document.getElementById(i + "-" + selectedColumn);
                if (cell.classList.contains("selected")) {
                    let row = parseInt(cell.id.split("-")[0]);
                    let col = parseInt(cell.id.split("-")[1]);
                    row += rowsPerBeat;
                    if (row < numRows + 1) {
                        newCell = document.getElementById(row + "-" + col);
                        noteMove(cell, newCell);
                    }
                }
            }
            break;
        case 'ArrowLeft':
            if (selectedColumn > 1) {
                for (let i = 1; i <= numRows; i++) {
                    let refCell = document.getElementById(i + "-" + selectedColumn);
                    if (refCell.classList.contains("selected")) {
                        let parent = refCell.dataset.parent;
                        if (parent != "") {
                            for (let k = i; k <= numRows; k++) {
                                let cell = document.getElementById(k + "-" + selectedColumn);
                                if (cell.dataset.parent == parent) {
                                    let row = parseInt(cell.id.split("-")[0]);
                                    let col = parseInt(cell.id.split("-")[1]);
                                    col--;
                                    newCell = document.getElementById(row + "-" + col);
                                    noteMove(cell, newCell);
                                }
                            }
                        }

                    }
                }
                selectedColumn--;
                notey[selectedColumn].currentTime = 0;
                notey[selectedColumn].play();
            }
            break;
        case 'ArrowRight':
            if (selectedColumn < 88) {
                for (let i = 1; i <= numRows; i++) {
                    let cell = document.getElementById(i + "-" + selectedColumn);
                    if (cell.classList.contains("selected")) {
                        let parent = cell.dataset.parent;
                        if (parent != "") {
                            for (let k = i; k <= numRows; k++) {
                                let childCell = document.getElementById(k + "-" + selectedColumn);
                                if (childCell.dataset.parent == parent) {
                                    let row = parseInt(childCell.id.split("-")[0]);
                                    let col = parseInt(childCell.id.split("-")[1]);
                                    col++;
                                    newCell = document.getElementById(row + "-" + col);
                                    noteMove(cell, newCell);
                                }
                            }
                        }

                    }
                }
                selectedColumn++;
                notey[selectedColumn].currentTime = 0;
                notey[selectedColumn].play();
            }
            break;
        default:
            break;
    }
});
function noteMove(cell, newCell) {
    newCell.dataset.parent = cell.dataset.parent;
    cell.removeAttribute("data-parent");
    newCell.classList.add("selected");
    newCell.classList.add("note");
    cell.classList.remove("selected");
    cell.classList.remove("note");
}