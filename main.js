import { io } from "socket.io-client";

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const clearButton = document.getElementById('clear-btn');

let drawing = false;
let color = '#000000';
let x = 0, y = 0;

const socket = io('http://localhost:3000');

socket.on('load', (boardState) => {
    console.log('Loading board state:', boardState);
    boardState.forEach(drawLine);
});

socket.on('draw', (data) => {
    console.log('Received draw event:', data);
    drawLine(data);
});

socket.on('clear', () => {
    console.log('Clear board event received');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const drawLine = ({ x0, y0, x1, y1, color }) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
};

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [x, y] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const x1 = e.offsetX;
    const y1 = e.offsetY;
    const data = { x0: x, y0: y, x1, y1, color };

    drawLine(data);

    socket.emit('draw', data);

    [x, y] = [x1, y1];
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
});

clearButton.addEventListener('click', () => {
    socket.emit('clear');
});
