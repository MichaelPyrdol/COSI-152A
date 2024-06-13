document.addEventListener('keydown', function (event) {
    if (titleScreen) {
        if (event.key == "Enter") {
            generateGrid();
        }
    } else {
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
                        let newSpot = document.getElementById(row - selectedNoteDuration + "-" + col);
                        if (!newSpot.classList.contains("note")) {
                            let theNote = [];
                            notes.forEach((note, noteIndex) => {
                                if (note[0].dataset.parent == parentID) {
                                    notes[noteIndex] = null;
                                }
                            })
                            let oldSpot = document.getElementById(parentID);
                            oldSpotPurge(theNote, oldSpot);
                            newSpot.classList.add("note");
                            newSpot.classList.add("selected");
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
                            noteSort();
                        }
                    }
                    break;
                case 'ArrowDown':
                    let parentID2 = selectRows[0].dataset.parent;
                    let row2 = parseInt(parentID2.split("-")[0]);
                    let col2 = parseInt(parentID2.split("-")[1]);
                    if (row2 < numRows) {
                        let newSpot = document.getElementById(row2 + 1 + "-" + col2);
                        if (!newSpot.classList.contains("note")) {
                            let theNote = [];
                            notes.forEach((note, noteIndex) => {
                                if (note[0].dataset.parent == parentID2) {
                                    notes[noteIndex] = null;
                                }
                            })
                            let oldSpot = document.getElementById(row2 - selectedNoteDuration + 1 + "-" + col2);
                            oldSpotPurge(theNote, oldSpot);
                            newSpot.classList.add("note");
                            newSpot.classList.add("selected");
                            let tempSelectRows = selectRows;
                            selectRows = [];
                            theNote.push(newSpot);
                            selectRows.push(newSpot);
                            tempSelectRows.forEach(cell => {
                                if (cell.id != newSpot.id) {
                                    theNote.push(cell);
                                    selectRows.push(cell);
                                }
                                cell.dataset.parent = row2 + 1 + "-" + col2;
                            })
                            newSpot.dataset.parent = row2 + 1 + "-" + col2;
                            notes = notes.filter(note => note != null);
                            notes.push(theNote);
                            playSound(selectedColumn);
                            noteSort();
                        }
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
    let free = true;
    selectRows.forEach(cell => {
        let row = parseInt(cell.id.split("-")[0]);
        let col = parseInt(cell.id.split("-")[1]) + direction;
        let newCell = document.getElementById(row + "-" + col);
        if (newCell.classList.contains("note")) {
            free = false;
        }
    })
    if (free) {
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
        noteSort();
    }
}