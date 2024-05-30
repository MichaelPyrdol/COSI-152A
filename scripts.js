function playSound(j) {
    // notey[j].currentTime = 0;
    notey[j].play();
    setTimeout(() => {
        notey[j].currentTime = notey[j].duration;
    }, 200);
}
function changeTempo(elem) {
    let tempoSlider = document.getElementById("tempoSlider");
    let tempoBox = document.getElementById("tempoBox");
    if (elem == "slider") {
        let newTempo = tempoSlider.value;
        tempo = newTempo;
        tempoBox.value = newTempo;
    } else {
        let newTempo = tempoBox.value;
        tempo = newTempo;
        tempoSlider.value = newTempo;
    }
    delay = 60000 / tempo / rowsPerBeat;
}
function finishSlide() {
    if (!paused) {
        playPause();
        playPause();
    }
}
function clearNotes() {
    noteRows.forEach(row => {
        row.removeAttribute("data-parent");
        row.classList.remove("note");
    })
    noteRows = [];
    parentRows = [];
    selectRows.forEach(row => {
        row.classList.remove("selected");
    })
    selectRows = [];
}
const contextMenu = document.getElementById('custom-context-menu');

function showContextMenu(event) {
    event.preventDefault();

    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let posX = event.pageX;
    let posY = event.pageY;

    if (posX + menuWidth > windowWidth) {
        posX = windowWidth - menuWidth;
    }
    if (posY + menuHeight > windowHeight) {
        posY = windowHeight - menuHeight;
    }

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;
    contextMenu.style.display = 'block';
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}

// document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu);

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

document.getElementById('menu-item-1').addEventListener('click', function () {
    alert('Item 1 clicked');
});
document.getElementById('menu-item-2').addEventListener('click', function () {
    alert('Item 2 clicked');
});
document.getElementById('menu-item-3').addEventListener('click', function () {
    alert('Item 3 clicked');
});
document.getElementById('menu-item-4').addEventListener('click', function () {
    alert('Item 4 clicked');
});
// document.getElementById('menu-item-5').addEventListener('click', function () {
//     alert('Item 5 clicked');
// });
// document.getElementById('menu-item-6').addEventListener('click', function () {
//     alert('Item 6 clicked');
// });
// document.getElementById('menu-item-7').addEventListener('click', function () {
//     alert('Item 7 clicked');
// });
// document.getElementById('menu-item-8').addEventListener('click', function () {
//     alert('Item 8 clicked');
// });