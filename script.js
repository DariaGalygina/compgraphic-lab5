let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.7;

let points = [];
let dotRadius = 6;
let curveSize = 2;
let editLinesSize = 1;

let isDragging = false;
let dragPoint = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

canvas.addEventListener('click', (e) => {
  if (e.button !== 0) return; 
  
  let x = e.offsetX;
  let y = e.offsetY;
  

  let clickedOnPoint = points.some(p => 
    Math.sqrt((x - p[0])**2 + (y - p[1])**2) <= dotRadius * 2
  );
  
  if (!clickedOnPoint) {
    points.push([x, y]);
    redrawScene();
  }
});

function redrawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (points.length >= 4) {
    drawCompositeBezier();
  }

  drawPointsAndLines();
}

function drawCompositeBezier() {
 
  let segments = Math.floor((points.length - 1) / 3);
  
  for (let i = 0; i < segments; i++) {
    let startIdx = i * 3;
    let p0 = points[startIdx];
    let p1 = points[startIdx + 1];
    let p2 = points[startIdx + 2];
    let p3 = points[startIdx + 3];
    
    drawBezierSegment(p0, p1, p2, p3);
  }
}

function drawBezierSegment(p0, p1, p2, p3) {
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  
  ctx.bezierCurveTo(
    p1[0], p1[1],
    p2[0], p2[1],
    p3[0], p3[1]
  );
  
  ctx.lineWidth = curveSize;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

function drawPointsAndLines() {
  if (points.length === 0) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  
  ctx.lineWidth = editLinesSize;
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.stroke();
  
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i][0], points[i][1], dotRadius, 0, 2 * Math.PI);
    

    if (i % 3 === 0 || i === points.length - 1) {
      ctx.fillStyle = 'black';
    } else {
      ctx.fillStyle = 'red';
    }
    
    ctx.fill();
    

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}


document.getElementById('clear-scene').addEventListener('click', clearScene);
function clearScene() {
  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  
  
  for (let point of points) {
    let distance = Math.sqrt((x - point[0])**2 + (y - point[1])**2);
    if (distance <= dotRadius * 2) {
      isDragging = true;
      dragPoint = point;
      dragOffsetX = x - point[0];
      dragOffsetY = y - point[1];
      canvas.style.cursor = 'grabbing';
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    let x = e.offsetX;
    let y = e.offsetY;
    
    dragPoint[0] = x - dragOffsetX;
    dragPoint[1] = y - dragOffsetY;
    
    redrawScene();
  } else {
    let x = e.offsetX;
    let y = e.offsetY;
    let overPoint = points.some(p => 
      Math.sqrt((x - p[0])**2 + (y - p[1])**2) <= dotRadius * 2
    );
    canvas.style.cursor = overPoint ? 'grab' : 'crosshair';
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  dragPoint = null;
  canvas.style.cursor = 'crosshair';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  dragPoint = null;
  canvas.style.cursor = 'crosshair';
});

canvas.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  
  let x = e.offsetX;
  let y = e.offsetY;
  
  let pointToRemove = null;
  for (let i = 0; i < points.length; i++) {
    let distance = Math.sqrt((x - points[i][0])**2 + (y - points[i][1])**2);
    if (distance <= dotRadius * 2) {
      pointToRemove = i;
      break;
    }
  }
  
  if (pointToRemove !== null) {
    points.splice(pointToRemove, 1);
    redrawScene();
  }
});

window.addEventListener('resize', () => {
  ctx.canvas.width = window.innerWidth * 0.95;
  ctx.canvas.height = window.innerHeight * 0.7;
  redrawScene();
});