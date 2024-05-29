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
            markerRows.forEach(row => {
                markerSnapshot.push(row);
            })
        }
        selectRows.forEach(row => {
            row.classList.remove("selected");
        });
        selectRows = [];
        for (let i = numRows; i >= 0; i--) {
            let play = setTimeout(function () {
                activeKeys.forEach(key => {
                    key.classList.remove("blackKeyPlay");
                    key.classList.remove("whiteKeyPlay");
                    key.classList.remove("cPlay");
                    key.classList.remove("dPlay1");
                    key.classList.remove("dPlay2");
                    key.classList.remove("ePlay");
                    key.classList.remove("fPlay");
                    key.classList.remove("gPlay1");
                    key.classList.remove("gPlay2");
                    key.classList.remove("aPlay1");
                    key.classList.remove("aPlay2");
                    key.classList.remove("bPlay");
                })
                activeKeys = [];
                // Note movement
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
                    if (cell.id.split("-")[0] == numRows) {
                        let key = document.getElementById(numRows + 1 + "-" + cell.id.split("-")[1])
                        playKey(key);
                    }
                });
                if (tempSelectRows != "") {
                    selectRows = tempSelectRows;
                    tempSelectRows = [];
                }
                // Measure marker movement
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
        if (whichKey % 12 == 4) {
            let cSharp = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
            if (cSharp != undefined) {
                oneKey(cSharp,"dPlay1","cPlay");
            }
        } else if (whichKey % 12 == 6) {
            let cSharp = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
            let dSharp = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
            twoKeys(cSharp, dSharp, "cPlay", "dPlay", "ePlay");
        } else if (whichKey % 12 == 8) {
            let dSharp = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
            oneKey(dSharp,"dPlay2","ePlay");
        } else if (whichKey % 12 == 9) {
            let fSharp = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
            oneKey(fSharp,"gPlay1","fPlay");
        } else if (whichKey % 12 == 11) {
            let fSharp = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
            let gSharp = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
            twoKeys(fSharp, gSharp, "fPlay", "gPlay", "aPlay1");
        } else if (whichKey % 12 == 1) {
            let fSharp = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
            let gSharp = document.getElementById(numRows + 2 + "-" + (whichKey + 1))
            twoKeys(fSharp, gSharp, "gPlay2", "aPlay", "bPlay");
        } else if (whichKey % 12 == 3) {
            let bFlat = document.getElementById(numRows + 2 + "-" + (whichKey - 1))
            oneKey(bFlat,"aPlay2","bPlay");
        }
    }
}
function oneKey(key,key1name,key2name){
    if (key.classList.contains(key1name)) {
        key.classList.remove(key1name);
        key.classList.add("whiteKeyPlay");
    } else {
        key.classList.add(key2name);
        activeKeys.push(key);
    }
}
function twoKeys(key1, key2, key1name, key2name, key3name) {
    if (key1.classList.contains(key1name)) {
        key1.classList.remove(key1name);
        key1.classList.add("whiteKeyPlay");
    } else {
        key1.classList.add(key2name + 1);
        activeKeys.push(key1);
    }
    if (key2.classList.contains(key3name)) {
        key2.classList.remove(key3name);
        key2.classList.add("whiteKeyPlay");
    } else {
        key2.classList.add(key2name + 2);
        activeKeys.push(key2);
    }
}