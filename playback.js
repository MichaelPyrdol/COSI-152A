const timeouts = [];
let paused = true;
let fromBeginning = true;
function playPause() {
    if (paused) {
        paused = false;
        if (fromBeginning) {
            fromBeginning = false;
            invisible();
            noteRows.forEach(row => {
                noteSnapshot.push(row);
                parentSnapshot.push(row.dataset.parent);
            })
            markerRows.forEach(row=>{
                markerSnapshot.push(row);
            })
        }
        selectRows.forEach(row => {
            row.classList.remove("selected");
        });
        selectRows = [];
        for (let i = numRows; i >= 0; i--) {
            let play = setTimeout(function () {
                noteRows.forEach(cell => {
                    if (cell.dataset.parent.split("-")[0] == numRows) {
                        // noteRows.forEach(noteRow => {
                        //     if (noteRow.dataset.parent == cell.id) {
                        //         noteRow.classList.add("noteHit");
                        //     }
                        // })
                        playSound(cell.id.split("-")[1]);
                    }
                    let row = parseInt(cell.id.split("-")[0]);
                    let col = parseInt(cell.id.split("-")[1]);
                    row++;
                    if (row < numRows + 2) {
                        let newCell = document.getElementById(row + "-" + col);
                        newCell.dataset.parent = parseInt(cell.dataset.parent.split("-")[0]) + 1 + "-" + cell.dataset.parent.split("-")[1];
                        cell.removeAttribute("data-parent");
                        newCell.classList.add("note");
                        cell.classList.remove("note");
                        noteRows = noteRows.filter(element => element != cell);
                        noteRows.push(newCell);
                    } else {
                        noteRows = noteRows.filter(element => element != cell);
                    }
                });
                if (tempSelectRows != "") {
                    selectRows = tempSelectRows;
                    tempSelectRows = [];
                }
                markerRows.forEach(cell => {
                    let row = parseInt(cell.id.split("-")[0]);
                    let col = parseInt(cell.id.split("-")[1]);
                    row++;
                    if (row < numRows + 2) {
                        let newCell = document.getElementById(row + "-" + col);
                        newCell.classList.add("markerContainer");
                        cell.classList.remove("markerContainer");
                        markerRows = markerRows.filter(element => element != cell);
                        markerRows.push(newCell);
                    } else {
                        markerRows = markerRows.filter(element => element != cell);
                    }
                })
            }, delay * (numRows - i), i);
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
    if (!fromBeginning) {
        fromBeginning = true;
        stop();
        visible();
        noteRows.forEach(row => {
            row.removeAttribute("data-parent");
            row.classList.remove("note");
            row.classList.remove("selected");
            // row.classList.remove("noteHit");
        })
        noteRows = [];
        noteSnapshot.forEach(row => {
            row.dataset.parent = parentSnapshot.shift();
            row.classList.add("note");
            noteRows.push(row)
        })
        noteSnapshot = [];
        markerRows.forEach(row=>{
            row.classList.remove("markerContainer")
        })
        markerRows=[];
        markerSnapshot.forEach(row=>{
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