function hover(i, j) {
    if (i < numRows) {
        if (fromBeginning) {
            hoverRows.forEach(row => {
                row.classList.remove("hover");
            });
            hoverRows.length = 0;
            if (mouseDown && hoverColumn != j) {
                playSound(j);
            }
            hoverColumn = j;
            let note = document.getElementById(i + "-" + j);
            let k = i;
            while (k < numRows && !note.classList.contains("beatTick")) {
                k++;
                note = document.getElementById(k + "-" + j);
            }
            let l = k;
            if (event.shiftKey && l - rowsPerBeat > 0) {
                while (k > l - rowsPerBeat * 2) {
                    hoverRows.push(note);
                    k--;
                    note = document.getElementById(k + "-" + j);
                }
            } else {
                while (k > l - rowsPerBeat) {
                    hoverRows.push(note);
                    k--;
                    note = document.getElementById(k + "-" + j);
                }
            }
            hoverRows.forEach(row => {
                row.classList.add("hover");
            });
        } else {
            hoverRows.forEach(row => {
                row.classList.remove("hover");
            });
            hoverRows.length = 0;
        }
    }
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
            selectRows.length = 0;
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
    if (fromBeginning) {
        parentRow = hoverRows[0];
        let parentID = parentRow.id;
        parentRows.push(parentRow);
        hoverRows.forEach(row => {
            row.dataset.parent = parentID;
            row.classList.add("selected");
            row.classList.add("note");
            row.addEventListener("mousedown", drag);
            selectRows.push(row);
            noteRows.push(row);
        });
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
            //     selectRows.length = 0;
            //     break;
            // case 'Backspace':
            //     selectRows.forEach(row => {
            //         row.classList.remove("selected");
            //         row.classList.remove("note");
            //         row.removeAttribute("data-parent");
            //         noteRows = noteRows.filter(element => element != cell);
            //     });
            //     selectRows.length = 0;
            //     break;
            case 'ArrowUp':
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
                break;
            case 'ArrowDown':
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
function drag() {
    mouseDown = true;
    selectRows.forEach(row => {
        row.classList.remove("selected");
    });
    selectRows.length = 0;
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
function changeTempo() {
    tempo = document.getElementById("tempo").value;
    delay = 60000 / tempo / rowsPerBeat;
}