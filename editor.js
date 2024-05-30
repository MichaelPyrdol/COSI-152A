function hover(i, j) {
    if (fromBeginning && i < numRows) {
        unhover();
        if (mouseDown && hoverColumn != j) {
            playSound(j);
        }
        hoverColumn = j;
        let row = document.getElementById(i + "-" + j);
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
                // Hovering over empty space — confined to the number of rows per measure quadrant
                while (k < numRows && !row.classList.contains("beatTick")) {
                    k++;
                    row = document.getElementById(k + "-" + j);
                }
                let l = k;
                // Debug start
                if (event.shiftKey && l - rowsPerBeat >= 0) {
                    while (k > l - rowsPerBeat * 2) {
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
            } else {
                // Hovering over a note of any duration - checks adjacent table rows for parent
                // Is there a bug in here??? 17 hoverRows??
                let parentID = row.dataset.parent;
                while (k < numRows && row.dataset.parent == parentID) {
                    k++;
                    row = document.getElementById(k + "-" + j);
                }
                row = document.getElementById(k - 1 + "-" + j);
                let tempSelectedNoteDuration = 0;
                // Why are there two parent rows???
                while (row.dataset.parent == parentID) {
                    // console.log(row.id);
                    tempSelectedNoteDuration++;
                    hoverRows.push(row);
                    k--;
                    row = document.getElementById(k + "-" + j);
                }
                // This is a weird thing.
                hoverRows.shift();
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
function unhover() {
    hoverRows.forEach(row => {
        row.classList.remove("hover");
    });
    hoverRows = [];
}
// Placing and selecting notes
function processNote(i, j) {
    if (fromBeginning) {
        let hoverNoteID = i + "-" + j;
        let note = document.getElementById(hoverNoteID);
        // Deselecting previous note
        if (!note.classList.contains("selected")) {
            selectRows.forEach(row => {
                row.classList.remove("selected");
            });
            selectRows = [];
            selectedNoteDuration = 0;
        }
        // Placing a note
        if (!note.classList.contains("note")) {
            placeNote();
        }
        selectedColumn = j;
        playSound(j);
    }
}
function placeNote() {
    if (fromBeginning && hoverRows != "") {
        let parentID = hoverRows[0].id;
        selectedNoteDuration = 0;
        hoverRows.forEach(row => {
            row.classList.add("selected");
            row.classList.add("note");
            row.dataset.parent = parentID;
            row.addEventListener("mousedown", drag);
            row.addEventListener("contextmenu", showContextMenu);
            selectRows.push(row);
            noteRows.push(row);
            selectedNoteDuration++;
        });
    }
}
function drag() {
    mouseDown = true;
    selectRows.forEach(row => {
        row.classList.remove("selected");
    });
    selectRows = [];
    hoverRows.forEach(row => {
        row.classList.remove("selected");
        row.classList.remove("note");
        row.removeAttribute("data-parent");
        row.removeEventListener("mousedown", drag);
        noteRows = noteRows.filter(element => element != row);
    });
}
function stopDrag() {
    if (mouseDown && fromBeginning) {
        mouseDown = false;
        placeNote();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.key == " ") {
        playPause();
    }
    if (fromBeginning) {
        switch (event.key) {
            // case 'Enter':
            //     selectRows.forEach(row => {
            //         row.classList.remove("selected");
            //     });
            //     selectRows = [];
            //     break;
            case 'Backspace':
                selectRows.forEach(row => {
                    row.classList.remove("selected");
                    row.classList.remove("note");
                    row.removeAttribute("data-parent");
                    row.removeEventListener("mousedown", drag);
                    row.removeEventListener("contextmenu", showContextMenu);
                    noteRows = noteRows.filter(element => element != row);
                });
                selectRows = [];
                break;
            case 'ArrowUp':
                if (selectedNoteDuration <= rowsPerBeat) {
                    selectRows.forEach(cell => {
                        let row = parseInt(cell.id.split("-")[0]);
                        let col = parseInt(cell.id.split("-")[1]);
                        row -= rowsPerBeat;
                        if (row > 0) {
                            newCell = document.getElementById(row + "-" + col);
                            newCell.dataset.parent = parseInt(cell.dataset.parent.split("-")[0]) - rowsPerBeat + "-" + cell.dataset.parent.split("-")[1];
                            noteMove(cell, newCell);
                        }
                    });
                    if (tempSelectRows != "") {
                        selectRows = tempSelectRows;
                        tempSelectRows = [];
                    }
                    playSound(selectedColumn);
                }
                break;
            case 'ArrowDown':
                if (selectedNoteDuration <= rowsPerBeat) {
                    selectRows.forEach(cell => {
                        let row = parseInt(cell.id.split("-")[0]);
                        let col = parseInt(cell.id.split("-")[1]);
                        row += rowsPerBeat;
                        if (row < numRows + 1) {
                            newCell = document.getElementById(row + "-" + col);
                            newCell.dataset.parent = parseInt(cell.dataset.parent.split("-")[0]) + rowsPerBeat + "-" + cell.dataset.parent.split("-")[1];
                            noteMove(cell, newCell);
                        }
                    });
                    if (tempSelectRows != "") {
                        selectRows = tempSelectRows;
                        tempSelectRows = [];
                    }
                    playSound(selectedColumn);
                }
                break;
            case 'ArrowLeft':
                if (selectedColumn > 1) {
                    selectRows.forEach(cell => {
                        let row = parseInt(cell.id.split("-")[0]);
                        let col = parseInt(cell.id.split("-")[1]);
                        col--;
                        newCell = document.getElementById(row + "-" + col);
                        newCell.dataset.parent = cell.dataset.parent.split("-")[0] + "-" + col;
                        noteMove(cell, newCell);
                    });
                    if (tempSelectRows != "") {
                        selectRows = tempSelectRows;
                        tempSelectRows = [];
                    }
                    selectedColumn--;
                    playSound(selectedColumn);
                }
                break;
            case 'ArrowRight':
                if (selectedColumn < 88) {
                    selectRows.forEach(cell => {
                        let row = parseInt(cell.id.split("-")[0]);
                        let col = parseInt(cell.id.split("-")[1]);
                        col++;
                        newCell = document.getElementById(row + "-" + col);
                        newCell.dataset.parent = cell.dataset.parent.split("-")[0] + "-" + col;
                        noteMove(cell, newCell);
                    });
                    if (tempSelectRows != "") {
                        selectRows = tempSelectRows;
                        tempSelectRows = [];
                    }
                    selectedColumn++;
                    playSound(selectedColumn);
                }
                break;
            default:
                break;
        }
    }
});
function noteMove(cell, newCell) {
    cell.removeAttribute("data-parent");
    cell.removeEventListener("mousedown", drag);
    newCell.addEventListener("mousedown", drag);
    newCell.classList.add("selected");
    newCell.classList.add("note");
    cell.classList.remove("selected");
    cell.classList.remove("note");
    noteRows = noteRows.filter(element => element != cell);
    noteRows.push(newCell);
    tempSelectRows.push(newCell);
}