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
                            let key = document.getElementById((numRows + 1) + "-" + cell.id.split("-")[1]);
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
function playKey(key) {
    activeKeys.push(key);
    if (key.classList.contains("black")) {
        key.classList.add("blackKeyPlay");
    } else {
        key.classList.add("whiteKeyPlay");
        whichKey = parseInt(key.id.split("-")[1]);
        bottomKey = document.getElementById(numRows + 2 + "-" + whichKey);
        activeKeys.push(bottomKey);
        bottomKey.classList.add("whiteKeyPlay");
        switch (whichKey % 12) {
            case 1: // A
                twoKeys(whichKey, "gPlay2", "aPlay", "bPlay");
                break;
            case 3: // B
                oneKey(whichKey - 1, "aPlay2", "bPlay");
                break;
            case 4: // C
                oneKey(whichKey + 1, "dPlay1", "cPlay");
                break;
            case 6: // D
                twoKeys(whichKey, "cPlay", "dPlay", "ePlay");
                break;
            case 8: // E
                oneKey(whichKey - 1, "dPlay2", "ePlay");
                break;
            case 9: // F
                oneKey(whichKey + 1, "gPlay1", "fPlay");
                break;
            case 11: // G
                twoKeys(whichKey, "fPlay", "gPlay", "aPlay1");
        }
    }
}
function oneKey(whichKey, key1name, key2name) {
    let key = document.getElementById(numRows + 2 + "-" + whichKey)
    if (key != undefined) {
        if (key.classList.contains(key1name)) {
            key.classList.remove(key1name);
            key.classList.add("whiteKeyPlay");
        } else {
            key.classList.add(key2name);
            activeKeys.push(key);
        }
    }
}
function twoKeys(whichKey, key1name, key2name, key3name) {
    let key1 = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
    let key2 = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
    if (key1 != undefined) {
        if (key1.classList.contains(key1name)) {
            key1.classList.remove(key1name);
            key1.classList.add("whiteKeyPlay");
        } else {
            key1.classList.add(key2name + 1);
            activeKeys.push(key1);
        }
    }
    if (key2.classList.contains(key3name)) {
        key2.classList.remove(key3name);
        key2.classList.add("whiteKeyPlay");
    } else {
        key2.classList.add(key2name + 2);
        activeKeys.push(key2);
    }
}
function refreshKeys() {
    activeKeys.forEach(key => {
        keyClasses = ["blackKeyPlay", "whiteKeyPlay", "cPlay", "dPlay1", "dPlay2", "ePlay", "fPlay", "gPlay1", "gPlay2", "aPlay1", "aPlay2", "bPlay"]
        keyClasses.forEach(classy => {
            key.classList.remove(classy);
        });
    })
    activeKeys = [];
}
function highlightKey(key) {
    if (paused) {
        refreshKeys();
        playKey(key);
    }
}