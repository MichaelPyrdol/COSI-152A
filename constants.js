let unitsPerRow = .3; // .3
let rowsPerBeat = 16; // 16 Integer only
let beatsPerMeasure = 4; // 4 Time Signature
let measureCount = 4; // 4
let tempo = 120; // 120

let numRows = rowsPerBeat * measureCount * beatsPerMeasure;
let delay = 60000 / tempo / rowsPerBeat;

let selectedColumn = 1;
let hoverColumn = 1;
var notey = {};

let hoverRows = [];

let selectRows = [];
let newRows = [];
let tempNoteRows = [];

let notes = [];

let markerRows=[];

let interval;

let noteSnapshot=[];
let parentSnapshot=[];
let markerSnapshot=[];

let activeKeys=[];

let mouseDown=false;

let done=false;
let repeating=false;

let selectedNoteDuration=0;

let contextMenuShow=false;

let titleScreen=true;