function hover(event) {
    row = event.target;
    elementID = row.id;
    i = elementID.split("-")[0];
    j = elementID.split("-")[1];
    if (dragging && hoverColumn != j) {
        playSound(j);
    }
    if (!contextMenuShow) {
        unhover();
        hoverColumn = j;
        let k = i;
        if (dragging) {
            // Dragging a note — size determined by selected note duration
            if (!event.shiftKey) {
                while (k < numRows && !row.classList.contains("beatTick")) {
                    k++;
                    row = document.getElementById(k + "-" + j);
                }
            }
            let l = k;
            while (k > 0 && k > l - selectedNoteDuration && !row.classList.contains("note")) {
                hoverRows.push(row);
                k--;
                row = document.getElementById(k + "-" + j);
            }
        } else {
            if (row.dataset.parent == undefined) {
                // Hovering over empty space — confined to default note duration
                if (!event.shiftKey) {
                    while (k < numRows && !row.classList.contains("beatTick")) {
                        k++;
                        row = document.getElementById(k + "-" + j);
                    }
                }
                // Offset
                if(defaultOffset != rowsPerBeat && k - i >= defaultOffset){
                    k -= rowsPerBeat-Math.ceil(i%rowsPerBeat/defaultOffset)*defaultOffset;
                    row = document.getElementById(k + "-" + j);
                }
                let l = k;
                while (k > l - defaultNoteDuration && k > 0 && !row.classList.contains("note")) {
                    hoverRows.push(row);
                    k--;
                    row = document.getElementById(k + "-" + j);
                }
                if (drawMode && drawing) {
                    placeNote();
                }
            } else {
                // Hovering over a note
                let parentID = row.dataset.parent;
                notes.forEach(note => {
                    if (note[0].dataset.parent == parentID) {
                        note.forEach(cell => {
                            hoverRows.push(cell);
                        })
                        selectedNoteDuration = note.length;
                    }
                })
                if (eraseMode && erasing) {
                    removeNote(hoverRows);
                }
            }
        }
        hoverRows.forEach(row1 => {
            row1.classList.add("hover");
        });
    }
}
function hoverKey() {
    element = event.target;
    elementID = element.id;
    i = elementID.split("-")[0];
    j = elementID.split("-")[1];
    key = document.getElementById("top-" + j);
    highlightKey(key);
    if (i == "bottom") {
        if (key.classList.contains("w")) {
            highlightKey(key);
        } else {
            refreshKeys();
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
    selectRows = hoverRows;
    selectRows.forEach(row => {
        row.classList.add("selected");
    });
    selectedNoteDuration = selectRows.length;
    selectedColumn = parseInt(selectRows[0].id.split("-")[1]);
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
        if (eraseMode) {
            removeNote(hoverRows);
        } else {
            if (!hoverRows[0].classList.contains("note")) {
                placeNote();
            }
            select();
            playSound(selectedColumn);
        }
    }
}
function placeNote() {
    if (fromBeginning && hoverRows != "") {
        let parentID = hoverRows[0].id;
        let note = [];
        hoverRows.forEach(row => {
            row.classList.add("note");
            row.dataset.parent = parentID;
            note.push(row);
        });
        notes.push(note)
    }
}
// Notes are sorted in the array to prevent playback glitches
function noteSort() {
    notes.sort((note1, note2) => {
        let row1 = parseInt(note1[0].dataset.parent.split("-")[0]);
        let row2 = parseInt(note2[0].dataset.parent.split("-")[0]);
        return row2 - row1;
    });
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
        if (event.button == "0" && hoverRows[0].classList.contains("note") && !eraseMode) {
            dragging = true;
            removeNote(hoverRows);
            deselect();
        } else if (drawMode) {
            drawing = true;
        } else if (eraseMode) {
            removeNote(hoverRows);
            deselect();
            erasing = true;
        }
    }
}
function stopDrag() {
    if (fromBeginning && dragging) {
        dragging = false;
        if (hoverRows != "") {
            placeNote();
            select();
        }
    }
    drawing = false;
    erasing = false;
}
function draw() {
    let draw = document.getElementById("draw");
    draw.classList.toggle("pressed");
    if (drawMode) {
        drawMode = false;
    } else {
        drawMode = true;
        let erase = document.getElementById("erase");
        erase.classList.remove("pressed");
        eraseMode = false;
    }
}
function erase() {
    let erase = document.getElementById("erase");
    erase.classList.toggle("pressed");
    if (eraseMode) {
        eraseMode = false;
    } else {
        eraseMode = true;
        let draw = document.getElementById("draw");
        draw.classList.remove("pressed");
        drawMode = false;
    }
}
function changeNoteDuration(duration) {
    selectRows = [];
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
        while (k > l - rowsPerBeat * duration && !row.classList.contains("note")) {
            hoverRows.push(row);
            k--;
            row = document.getElementById(k + "-" + key);
        }
        hoverRows.forEach(row1 => {
            row1.classList.add("hover");
        });
        placeNote();
        select();
    }
}