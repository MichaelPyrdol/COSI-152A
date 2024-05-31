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
                    emptyBeat = true;
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
    // selectedNoteDuration = 0;
}
// Placing and selecting notes
function processClick() {
    if (fromBeginning) {
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
        hoverRows.forEach(row => {
            row.classList.add("note");
            row.dataset.parent = parentID;
            noteRows.push(row);
        });
        select();
    }
}
function removeNote(whichRows) {
    whichRows.forEach(row => {
        row.classList.remove("note");
        row.removeAttribute("data-parent");
        noteRows = noteRows.filter(element => element != row);
    });
}
function drag() {
    if (fromBeginning && event.button == 0 && hoverRows[0].classList.contains("note")) {
        mouseDown = true;
        removeNote(hoverRows);
        deselect();
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
    if(!titleScreen){
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
                    noteMoveVertical(-rowsPerBeat);
                    break;
                case 'ArrowDown':
                    noteMoveVertical(rowsPerBeat);
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
function noteMoveVertical(direction) {
    if (selectedNoteDuration <= rowsPerBeat) {
        selectRows.forEach(cell => {
            let row = parseInt(cell.id.split("-")[0]) + direction;
            let col = parseInt(cell.id.split("-")[1]);
            if (row > 0 && row < numRows + 1) {
                newCell = document.getElementById(row + "-" + col);
                newCell.dataset.parent = parseInt(cell.dataset.parent.split("-")[0]) + direction + "-" + cell.dataset.parent.split("-")[1];
                cellMove(newCell);
            }
        });
        afterMove();
    }
}
function noteMoveHorizontal(direction) {
    selectRows.forEach(cell => {
        let row = parseInt(cell.id.split("-")[0]);
        let col = parseInt(cell.id.split("-")[1]) + direction;
        newCell = document.getElementById(row + "-" + col);
        newCell.dataset.parent = cell.dataset.parent.split("-")[0] + "-" + col;
        cellMove(newCell);
    });
    selectedColumn += direction;
    afterMove();
}
function cellMove(newCell) {
    newCell.classList.add("selected");
    newCell.classList.add("note");
    noteRows.push(newCell);
    tempSelectRows.push(newCell);
}
function afterMove() {
    removeNote(selectRows);
    deselect();
    if (tempSelectRows != "") {
        selectRows = tempSelectRows;
        tempSelectRows = [];
    }
    playSound(selectedColumn);
}