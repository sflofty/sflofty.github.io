let timerSeconds;
let timer;

const startTimer = () => {
  clearInterval(timer);

  timerSeconds = 0;
  document.getElementById('timer').innerHTML = '00:00';

  timer = setInterval(() => {
    console.log(timerSeconds);
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

  startTimer();
}

function toggleCellColor(row, col) {
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
