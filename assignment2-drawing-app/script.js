const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const colorPicker = document.getElementById("colorPicker");
const penButton = document.getElementById("penButton");
const eraserButton = document.getElementById("eraserButton");
const saveButton = document.getElementById("saveButton");
const brushSize = document.getElementById("brushSize");
const brushSizeValue = document.getElementById("brushSizeValue");

canvas.width = 600;
canvas.height = 400;

let isDrawing = false;

ctx.lineWidth = brushSize.value;
ctx.lineCap = "round";
ctx.strokeStyle = colorPicker.value;

canvas.addEventListener("mousedown", function (event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener("mousemove", function (event) {
  if (!isDrawing) {
    return;
  }

  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", function () {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", function () {
  isDrawing = false;
});

clearButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

colorPicker.addEventListener("input", function () {
  ctx.strokeStyle = colorPicker.value;
});

penButton.addEventListener("click", function () {
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = brushSize.value;
});

eraserButton.addEventListener("click", function () {
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = brushSize.value;
});

saveButton.addEventListener("click", function () {
  const link = document.createElement("a");
  link.download = "my-drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

brushSize.addEventListener("input", function () {
  ctx.lineWidth = brushSize.value;
  brushSizeValue.textContent = brushSize.value;
});