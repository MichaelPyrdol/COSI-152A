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
            noteSort();
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
        if (smooth) {
            let startTime;
            let lastTime = 0;
            let currentIndex = 0;
            function animateSteps(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;

                // Update currentIndex based on the delay
                if (elapsed - lastTime >= delay) {
                    lastTime = elapsed;
                    currentIndex++;
                    if (currentIndex <= numRows) {
                        playStep(currentIndex);
                    }
                }

                // Continue the animation until all steps are played
                if (currentIndex <= numRows) {
                    const timeout = requestAnimationFrame(animateSteps);
                    timeouts.push(timeout);
                }
            }
            requestAnimationFrame(animateSteps);
        } else {
            for (let i = numRows; i >= 0; i--) {
                let timeout = setTimeout(playStep, delay * (numRows - i), i);
                timeouts.push(timeout);
            }
        }
    } else {
        stop();
    }
}
function playStep(i) {
    refreshKeys();
    notes.forEach((note, noteIndex) => {
        // Note movement
        let parentID = note[0].id;
        let parentRow = parseInt(parentID.split("-")[0]);
        let parentCol = parseInt(parentID.split("-")[1]);
        let newNoteArray = [];
        let noteLength = note.length;
        let lastRow = note[noteLength - 1];
        lastRow.removeAttribute("data-parent");
        lastRow.classList.remove("note");
        if (parentRow + 1 < numRows + 1) { // If new parent
            let newCell = document.getElementById(parentRow + 1 + "-" + parentCol);
            if (newCell) {
                newCell.classList.add("note");
                newCell.dataset.parent = parentRow + 1 + "-" + parentCol;
                newNoteArray.push(newCell);
            }
        }
        for (let i = 0; i < noteLength - 1; i++) {
            newNoteArray.push(note[i]);
        }
        note.forEach(cell => {
            // Note sound
            if (cell.id.split("-")[0] == numRows && !cell.classList.contains("active")) {
                note.forEach(cell2=>{
                    cell2.classList.add("active");
                })
                let col = parseInt(cell.id.split("-")[1]);
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
    let newMarkerRows = [];
    markerRows.forEach(cell => {
        let row = parseInt(cell.id.split("-")[0]) + 1;
        let col = parseInt(cell.id.split("-")[1]);
        if (row < numRows + 2) {
            let newCell = document.getElementById(row + "-" + col);
            if (newCell) {
                newCell.classList.add("markerContainer");
                cell.classList.remove("markerContainer");
                newMarkerRows.push(newCell);
            }
        }
    });
    markerRows = newMarkerRows;
    if (i == 0) {
        refreshKeys();
        if (repeating) {
            restart();
        } else {
            stop();
        }
    }
}
function stop() {
    paused = true;
    play.innerHTML = "<img src='images/play.png'>"
    if (smooth) {
        timeouts.forEach(timeout => cancelAnimationFrame(timeout));
    } else {
        timeouts.forEach(timeout => clearTimeout(timeout));
    }
    timeouts = [];
}
function reset() {
    if (!fromBeginning) {
        fromBeginning = true;
        stop();
        visible();
        refreshKeys();
        addHoverEvents();
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
function draw() {
    let draw = document.getElementById("draw");
    draw.classList.toggle("pressed");
    if (drawMode) {
        drawMode = false;
    } else {
        drawMode = true;
    }
}
function invisible() {
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.add("off");
            cell.removeEventListener("mouseover", hover);
        }
    }
}
function visible() {
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= 88; j++) {
            cell = document.getElementById(i + "-" + j);
            cell.classList.remove("off");
            cell.classList.remove("active");
        }
    }
}