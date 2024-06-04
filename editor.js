function hover(i, j) {
    if (fromBeginning && i > 0 && i < numRows) {
        if (mouseDown && hoverColumn != j) {
            playSound(j);
        }
        let row = document.getElementById(i + "-" + j);
        if (!row.classList.contains("hover") && !contextMenuShow) {
            unhover();
            hoverColumn = j;
            let k = i;
            if (mouseDown) {
                // Dragging a note — size determined by selected note duration
                while (k < numRows && !row.classList.contains("beatTick")) {
                    k++;
                    row = document.getElementById(k + "-" + j);
                }
                let l = k;
                if (l - selectedNoteDuration >= 0) {
                    while (k > l - selectedNoteDuration) {
                        hoverRows.push(row);
                        k--;
                        row = document.getElementById(k + "-" + j);
                    }
                }
            } else {
                if (row.dataset.parent == undefined) {
                    // Hovering over empty space — confined to the number of rows per beat
                    let emptyBeat = true;
                    let scout = row;
                    let m = k;
                    while (emptyBeat && m > 1 && !scout.classList.contains("beatTick")) {
                        m--;
                        scout = document.getElementById(m + "-" + j);
                        if (scout.classList.contains("note")) {
                            emptyBeat = false;
                        }
                    }
                    while (emptyBeat && k < numRows && !row.classList.contains("beatTick")) {
                        k++;
                        row = document.getElementById(k + "-" + j);
                        if (row.classList.contains("note")) {
                            emptyBeat = false;
                        }
                    }
                    let l = k;
                    // Debug start
                    if (emptyBeat) {
                        if (event.shiftKey && l - rowsPerBeat >= 0) {
                            while (k > l - rowsPerBeat / 2) {
                                hoverRows.push(row);
                                k--;
                                row = document.getElementById(k + "-" + j);
                            }
                            // Debug end
                        } else {
                            while (k > l - rowsPerBeat) {
                                hoverRows.push(row);
                                k--;
                                row = document.getElementById(k + "-" + j);
                            }
                        }
                    }
                } else {
                    // Hovering over a note of any duration - checks adjacent table rows for parent
                    let parentID = row.dataset.parent;
                    while (k < numRows + 1 && row.dataset.parent == parentID) {
                        k++;
                        row = document.getElementById(k + "-" + j);
                    }
                    row = document.getElementById(k - 1 + "-" + j);
                    let tempSelectedNoteDuration = 0;
                    while (k > 0 && row.dataset.parent == parentID) {
                        tempSelectedNoteDuration++;
                        hoverRows.push(row);
                        k--;
                        row = document.getElementById(k + "-" + j);
                    }
                    hoverRows.shift(); // ???
                    tempSelectedNoteDuration--;
                    if (tempSelectedNoteDuration != selectedNoteDuration) {
                        selectedNoteDuration = tempSelectedNoteDuration;
                    }
                }
            }
            hoverRows.forEach(row1 => {
                row1.classList.add("hover");
            });
        }
    }
}
function unhover() {
    if (!contextMenuShow) {
        hoverRows.forEach(row => {
            row.classList.remove("hover");
        });
        hoverRows = [];
    }
}
function select() {
    selectedNoteDuration = 0;
    hoverRows.forEach(row => {
        row.classList.add("selected");
        selectRows.push(row);
        selectedNoteDuration++;
    });
    selectedColumn = parseInt(hoverRows[0].id.split("-")[1]);
}
function deselect() {
    selectRows.forEach(row => {
        row.classList.remove("selected");
    });
    selectRows = [];
}
// Placing and selecting notes
function processClick() {
    if (fromBeginning && hoverRows != "") {
        // Deselecting previous note
        deselect();
        // Placing a note
        if (hoverRows[0].classList.contains("note")) {
            select();
        } else {
            placeNote();
        }
        playSound(selectedColumn);
    }
}
function placeNote() {
    if (fromBeginning) {
        let parentID = hoverRows[0].id;
        let note = [];
        hoverRows.forEach(row => {
            row.classList.add("note");
            row.dataset.parent = parentID;
            note.push(row);
        });
        notes.push(note)
        select();
    }
}
function removeNote(whichRows) {
    notes.forEach(note => {
        if (note[0].dataset.parent == whichRows[0].dataset.parent) {
            whichRows.forEach(row => {
                row.classList.remove("note");
                row.removeAttribute("data-parent");
            });
            notes = notes.filter(element => element != note);
        }
    })
}
function drag() {
    if (hoverRows != "") {
        if (fromBeginning && event.button == 0 && hoverRows[0].classList.contains("note")) {
            mouseDown = true;
            removeNote(hoverRows);
            deselect();
        }
    }
}
function stopDrag() {
    if (fromBeginning && mouseDown) {
        mouseDown = false;
        if (hoverRows != "") {
            placeNote();
        }
    }
}
function changeNoteDuration(duration) {
    selectRows = [];
    selectedNoteDuration = duration;
    let row = hoverRows[0];
    removeNote(hoverRows);
    // Unhover
    hoverRows.forEach(row => {
        row.classList.remove("hover");
    });
    hoverRows = [];
    // Unhover
    k = row.id.split("-")[0];
    key = row.id.split("-")[1];
    let l = k;
    if (l - rowsPerBeat * duration > 0) {
        while (k > l - rowsPerBeat * duration) {
            hoverRows.push(row);
            k--;
            row = document.getElementById(k + "-" + key);
        }
        hoverRows.forEach(row1 => {
            row1.classList.add("hover");
        });
        placeNote();
    }
}
document.addEventListener('keydown', function (event) {
    if (!titleScreen) {
        if (event.key == " ") {
            playPause();
        }
        if (fromBeginning && selectRows != "") {
            switch (event.key) {
                case 'Enter':
                    deselect();
                    break;
                case 'Backspace':
                    removeNote(selectRows);
                    deselect();
                    break;
                case 'ArrowUp':
                    let parentID = selectRows[0].dataset.parent;
                    let row = parseInt(parentID.split("-")[0]);
                    let col = parseInt(parentID.split("-")[1]);
                    if (row - selectedNoteDuration > 0) {
                        let theNote = [];
                        notes.forEach((note, noteIndex) => {
                            if (note[0].dataset.parent == parentID) {
                                notes[noteIndex] = null;
                            }
                        })
                        let oldSpot = document.getElementById(parentID);
                        oldSpotPurge(theNote, oldSpot);
                        let newSpot = document.getElementById(row - selectedNoteDuration + "-" + col);
                        newSpot.classList.add("note");
                        newSpot.classList.add("selected");
                        theNote.push(newSpot);
                        selectRows.push(newSpot);
                        selectRows.forEach(cell => {
                            cell.dataset.parent = row - 1 + "-" + col;
                        })
                        notes = notes.filter(note => note != null);
                        selectRows.forEach(row => {
                            theNote.push(row);
                        })
                        notes.push(theNote);
                        playSound(selectedColumn);
                    }
                    break;
                case 'ArrowDown':
                    let parentID2 = selectRows[0].dataset.parent;
                    let row2 = parseInt(parentID2.split("-")[0]);
                    let col2 = parseInt(parentID2.split("-")[1]);
                    if (row2 < numRows) {
                        let theNote2 = [];
                        notes.forEach((note, noteIndex) => {
                            if (note[0].dataset.parent == parentID2) {
                                notes[noteIndex] = null;
                            }
                        })
                        let oldSpot = document.getElementById(row2 - selectedNoteDuration + 1 + "-" + col2);
                        oldSpotPurge(theNote2, oldSpot);
                        let newSpot = document.getElementById(row2 + 1 + "-" + col2);
                        newSpot.classList.add("note");
                        newSpot.classList.add("selected");
                        let tempSelectRows = selectRows;
                        selectRows = [];
                        theNote2.push(newSpot);
                        selectRows.push(newSpot);
                        tempSelectRows.forEach(cell => {
                            if (cell.id != newSpot.id) {
                                theNote2.push(cell);
                                selectRows.push(cell);
                            }
                            cell.dataset.parent = row2 + 1 + "-" + col2;
                        })
                        newSpot.dataset.parent = row2 + 1 + "-" + col2;
                        notes = notes.filter(note => note != null);
                        notes.push(theNote2);
                        playSound(selectedColumn);
                    }
                    break;
                case 'ArrowLeft':
                    if (selectedColumn > 1) {
                        noteMoveHorizontal(-1);
                    }
                    break;
                case 'ArrowRight':
                    if (selectedColumn < 88) {
                        noteMoveHorizontal(1);
                    }
                    break;
                default:
                    break;
            }
        }
    }
});
function oldSpotPurge(theNote, oldSpot) {
    oldSpot.classList.remove("note");
    oldSpot.classList.remove("selected");
    oldSpot.removeAttribute("data-parent");
    theNote = theNote.filter(element => element != oldSpot);
    selectRows = selectRows.filter(element => element != oldSpot);
}
function noteMoveHorizontal(direction) {
    let parentID = selectRows[0].dataset.parent;
    let theNote = [];
    let newNote = [];
    notes.forEach((note, noteIndex) => {
        if (note[0].dataset.parent == parentID) {
            notes[noteIndex] = null;
        }
    })
    selectRows.forEach(cell => {
        let row = parseInt(cell.id.split("-")[0]);
        let col = parseInt(cell.id.split("-")[1]) + direction;
        let newCell = document.getElementById(row + "-" + col);
        cell.classList.remove("note");
        cell.removeAttribute("data-parent");
        newCell.dataset.parent = parentID.split("-")[0] + "-" + col;
        newNote.push(newCell);
    });
    selectedColumn += direction;
    deselect();
    if (newNote.length > 0) {
        selectRows = newNote;
    }
    notes = notes.filter(note => note != null);
    selectRows.forEach(row => {
        theNote.push(row);
        row.classList.add("selected");
        row.classList.add("note");
    })
    notes.push(theNote);
    playSound(selectedColumn);
}