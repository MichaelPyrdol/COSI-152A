const rowsPerBeat = 16; // 16 Integer only
const measureCount = 4; // 4
const beatsPerMeasure = 4; // 4 Time Signature
let tempo = 120; // 120
const rowHeight = .3; // .3

const numRows = rowsPerBeat * measureCount * beatsPerMeasure;
let delay = 60000 / tempo / rowsPerBeat;

let selectedColumn = 1;
let hoverColumn = 1;
var notey = {};

let hoverRows = [];

let selectRows = [];
let tempSelectRows = [];

let noteRows = [];

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