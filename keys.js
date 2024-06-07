function playKey(key) {
    activeKeys.push(key);
    if (key.classList.contains("b")) {
        key.classList.add("bKeyPlay");
    } else {
        key.classList.add("wKeyPlay");
        whichKey = parseInt(key.id.split("-")[1]);
        bottomKey = document.getElementById("bottom-" + whichKey);
        activeKeys.push(bottomKey);
        bottomKey.classList.add("wKeyPlay");
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
    let key = document.getElementById("bottom-" + whichKey)
    if (key != undefined) {
        if (key.classList.contains(key1name)) {
            key.classList.remove(key1name);
            key.classList.add("wKeyPlay");
        } else {
            key.classList.add(key2name);
            activeKeys.push(key);
        }
    }
}
function twoKeys(whichKey, key1name, key2name, key3name) {
    let key1 = document.getElementById("bottom-" + (whichKey - 1))
    let key2 = document.getElementById("bottom-" + (whichKey + 1))
    if (key1 != undefined) {
        if (key1.classList.contains(key1name)) {
            key1.classList.remove(key1name);
            key1.classList.add("wKeyPlay");
        } else {
            key1.classList.add(key2name + 1);
            activeKeys.push(key1);
        }
    }
    if (key2.classList.contains(key3name)) {
        key2.classList.remove(key3name);
        key2.classList.add("wKeyPlay");
    } else {
        key2.classList.add(key2name + 2);
        activeKeys.push(key2);
    }
}
function refreshKeys() {
    activeKeys.forEach(key => {
        keyClasses = ["bKeyPlay", "wKeyPlay", "cPlay", "dPlay1", "dPlay2", "ePlay", "fPlay", "gPlay1", "gPlay2", "aPlay1", "aPlay2", "bPlay"]
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
function playSelected() {
    if (fromBeginning && activeKeys != "") {
        playSound(activeKeys[0].id.split("-")[1]);
    }
}