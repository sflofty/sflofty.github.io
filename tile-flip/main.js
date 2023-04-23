let timerSeconds;
let timer;
let moves;

const startTimer = () => {
  clearInterval(timer);

  timerSeconds = 0;
  document.getElementById('timer').innerHTML = '00:00';

  timer = setInterval(() => {
    timerSeconds += 1;
    document.getElementById('timer').innerHTML =
      pad(Math.floor(timerSeconds / 60), 2) + ':' + pad(timerSeconds % 60, 2);
  }, 1000);
};

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}

function createBoard() {
  boardSize = document.getElementById('board-size').value;
  const table = document.getElementById('game-board');
  table.innerHTML = ''; // clear previous table

  // create new board cells
  for (let i = 0; i < boardSize; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < boardSize; j++) {
      const td = document.createElement('td');
      td.onclick = () => {
        toggleCellColor(i, j);
      };
      td.style.backgroundColor = 'black';
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (Math.random() < 0.5) toggleCellColor(i, j);
    }
  }

  moves = 0;
  startTimer();
}

function toggleCellColor(row, col) {
  moves += 1;
  const board = document.getElementById('game-board');

  // change adjacent cells color
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < board.rows.length &&
      newCol >= 0 &&
      newCol < board.rows[0].cells.length
    ) {
      let cell = board.rows[newRow].cells[newCol];
      let newColor = cell.style.backgroundColor == 'white' ? 'black' : 'white';
      cell.style.backgroundColor = newColor;
    }
  }

  if (isDone()) {
    clearInterval(timer);
    initConfetti();
  }
}

const isDone = () => {
  const board = document.getElementById('game-board');
  for (let i = 0; i < board.rows.length; i++) {
    for (let j = 0; j < board.rows[0].cells.length; j++) {
      let cell = board.rows[i].cells[j];
      if (cell.style.backgroundColor == 'white') {
        return false;
      }
    }
  }
  return true;
};

function empire() {
  const table = document.getElementById('game-board');
  table.innerHTML = ''; // clear previous table

  const colors = [
    0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0,
  ];
  let position = 0;

  for (let i = 0; i < 5; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 5; j++) {
      const td = document.createElement('td');
      td.onclick = () => {
        toggleCellColor(i, j);
      };
      td.style.backgroundColor = colors[position] == 1 ? 'black' : 'white';
      position += 1;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  startTimer();
}

function rebellion() {
  const table = document.getElementById('game-board');
  table.innerHTML = ''; // clear previous table

  let black = true;

  for (let i = 0; i < 5; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 5; j++) {
      const td = document.createElement('td');
      td.onclick = () => {
        toggleCellColor(i, j);
      };
      td.style.backgroundColor = black ? 'black' : 'white';
      black = !black;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  startTimer();
}

window.onload = function () {
  createBoard();
};


//
// CONFETTI
//

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
{ front: 'red', back: 'darkred' },
{ front: 'green', back: 'darkgreen' },
{ front: 'blue', back: 'darkblue' },
{ front: 'yellow', back: 'darkyellow' },
{ front: 'orange', back: 'darkorange' },
{ front: 'pink', back: 'darkpink' },
{ front: 'purple', back: 'darkpurple' },
{ front: 'turquoise', back: 'darkturquoise' }];


//-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30) },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1 },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1 },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50) } });
  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  window.requestAnimationFrame(render);
};

//---------Execution--------
render();

//----------Resize----------
window.addEventListener('resize', function () {
  resizeCanvas();
});
