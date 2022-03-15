let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; // store current progress
let track = 0; // represent action from tracker array

let mouseDown = false;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

//mouse -> start new path , mousemove -> path fill(graphic)
canvas.addEventListener("mousedown",(e) => {
    mouseDown = true;
    beginPath({
        x: e.clientX,
        y: e.clientY
    })
})

canvas.addEventListener("mousemove",(e) => {
    if(mouseDown) drawStroke({
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : penColor,
        width: eraserFlag ? eraserWidth : penWidth 

    })
})

canvas.addEventListener("mouseup",(e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click",(e) => {
    if(track > 0) track--;
    // track action
    let trackObj = {
        trackValue:track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})
redo.addEventListener("click",(e) => {
    if(track < undoRedoTracker.length-1) track++;

    // track action
    let trackObj = {
        trackValue:track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})
function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url =undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }

}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}


pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click",(e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change",(e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})


eraserWidthElem.addEventListener("change",(e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click",(e) => {
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})


download.addEventListener("click",(e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})