let timeouts = [];
let paused = true;
let fromBeginning = true;
let play = document.getElementById("play");
function playPause() {
    if (paused) {
        paused = false;
        play.innerHTML = "<img src='images/pause.png'>";
        if (fromBeginning) {
            fromBeginning = false;
            invisible();
            unhover();
            deselect();
            noteSnapshot = [];
            parentSnapshot = [];
            notes.forEach(note => {
                noteSnapshot.push(note);
                parentSnapshot.push(note[0].dataset.parent);
            });
            markerSnapshot.length = 0;
            markerRows.forEach(row => {
                markerSnapshot.push(row);
            });
        }
        for (let i = numRows; i >= 0; i--) {
            let play = setTimeout(function () {
                refreshKeys();
                notes.forEach((note, noteIndex) => {
                    let parentID = note[0].dataset.parent;
                    let newNoteArray = [];
                    let lastRow = "";
                    let min = numRows;
                    note.forEach(cell => {
                        row = parseInt(cell.id.split("-")[0]);
                        if (row < min) {
                            min = row;
                        }
                    })
                    note.forEach(cell => {
                        row = parseInt(cell.id.split("-")[0]);
                        if (row == min) {
                            lastRow = cell;
                        } else {
                            newNoteArray.push(cell);
                        }
                    })
                    if (lastRow) {
                        lastRow.removeAttribute("data-parent");
                        lastRow.classList.remove("note");
                    }
                    let parentRow = parseInt(parentID.split("-")[0]);
                    let parentCol = parseInt(parentID.split("-")[1]);
                    if (parentRow + 1 < numRows + 1) {
                        let newCell = document.getElementById(parentRow + 1 + "-" + parentCol);
                        if (newCell) {
                            newCell.classList.add("note");
                            newNoteArray.push(newCell);
                        }
                    }
                    newNoteArray.forEach(cell => {
                        cell.dataset.parent = parentRow + 1 + "-" + parentCol;
                    });
                    note.forEach(cell => {
                        let col = parseInt(cell.id.split("-")[1]);
                        // Note sound
                        if (cell.id === parentID && parentID.split("-")[0] == numRows) {
                            playSound(col, note.length);
                        }
                        // Piano display
                        if (cell.id.split("-")[0] == numRows) {
                            let key = document.getElementById("top-" + cell.id.split("-")[1]);
                            playKey(key);
                        }
                    });
                    if (newNoteArray.length > 0) {
                        notes[noteIndex] = newNoteArray;
                    } else {
                        notes[noteIndex] = null;
                    }
                })
                notes = notes.filter(note => note != null);
                // Measure marker movement
                markerRows.forEach(cell => {
                    let row = parseInt(cell.id.split("-")[0]);
                    let col = parseInt(cell.id.split("-")[1]);
                    row++;
                    if (row < numRows + 2) {
                        let newCell = document.getElementById(row + "-" + col);
                        if (newCell) {
                            newCell.classList.add("markerContainer");
                            cell.classList.remove("markerContainer");
                            markerRows = markerRows.filter(element => element !== cell);
                            markerRows.push(newCell);
                        }
                    } else {
                        markerRows = markerRows.filter(element => element !== cell);
                    }
                });
                if (i == 0) {
                    refreshKeys();
                    if (repeating) {
                        restart();
                    } else {
                        stop();
                        return;
                    }
                }
            }, delay * (numRows - i), i);
            timeouts.push(play);
        }
    } else {
        stop();
    }
}
function stop() {
    paused = true;
    play.innerHTML = "<img src='images/play.png'>"
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
}
function reset() {
    if (!fromBeginning) {
        fromBeginning = true;
        stop();
        visible();
        refreshKeys();
        notes.forEach(note => {
            note.forEach(row => {
                row.removeAttribute("data-parent");
                row.classList.remove("note");
                row.classList.remove("selected");
            })
        })
        notes = [];
        noteSnapshot.forEach(note => {
            parentID = parentSnapshot.shift()
            note.forEach(row => {
                row.dataset.parent = parentID;
                row.classList.add("note");
            })
            notes.push(note);
        })
        noteSnapshot = [];
        markerRows.forEach(row => {
            row.classList.remove("markerContainer")
        })
        markerRows = [];
        markerSnapshot.forEach(row => {
            row.classList.add("markerContainer")
            markerRows.push(row);
        })
        markerSnapshot = [];
    }
}
function restart() {
    reset();
    playPause();
}
function repeat() {
    let repeat = document.getElementById("repeat");
    repeat.classList.toggle("pressed");
    if (repeating) {
        repeating = false;
    } else {
        repeating = true;
    }
}
function invisible() {
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.add("off");
        }
    }
}
function visible() {
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.remove("off");
        }
    }
}