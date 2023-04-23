let boardSize = 3; // default board size

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
}

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
}
