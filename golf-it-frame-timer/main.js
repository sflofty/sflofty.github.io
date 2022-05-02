function compute() {
  // Initiate basic time variables
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;

  // Get framerate, start frame, and end frame from corresponding elements
  let frameRate = parseInt(document.getElementById('framerate').value);

  let totalFrames = 0;
  for (var i = 1; i <= 18; i++) {
    totalFrames += parseInt(document.getElementById('rowTotal' + i).innerText);
  }  

  // Calculate framerate
  seconds = Math.floor(totalFrames / frameRate);
  let frames = totalFrames % frameRate;
  milliseconds = Math.round((frames / frameRate) * 1000);
  if (milliseconds < 10) {
    milliseconds = '00' + milliseconds;
  } else if (milliseconds < 100) {
    milliseconds = '0' + milliseconds;
  }
  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
  }
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
  }

  // Show the time and mod message in the DOM
  let finalTime =
    hours.toString() +
    'h ' +
    minutes.toString() +
    'm ' +
    seconds.toString() +
    's ' +
    milliseconds.toString() +
    'ms';
  document.getElementById('totalTime').innerHTML = finalTime;

  let modMessage = `Mod Message: in-game time manually retimed using [yt-frame-timer](https://sflofty.github.io/golf-it-frame-timer). Got ${totalFrames} frames at ${frameRate} fps to get a final time of ${finalTime}.`;
  document.getElementById('modMessage').disabled = false;
  document.getElementById('modMessage').innerText = modMessage;
  document.getElementById('modMessageButton').disabled = false;
}

function copyModMessage() {
  // Allow user to copy mod message to clipboard
  const textArea = document.getElementById('modMessage');
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  alert(
    `The mod message has been copied to clipboard! Please paste it into the comment of the run you are verifying.`
  );
}

const validateFPS = (event) => {
  // If framerate is invalid, show an error message and disable start and end frame fields
  if (
    event.target.value === '' ||
    parseInt(event.target.value) <= 0 ||
    isNaN(parseInt(event.target.value))
  ) {
    document
      .getElementById('framerate')
      .setCustomValidity('Please enter a valid framerate.');
    document.getElementById('framerate').reportValidity();
    document.getElementById('startobj').disabled = true;
    document.getElementById('endobj').disabled = true;
    document.getElementById('computeButton').disabled = true;
  } else {
    document.getElementById('startobj').disabled = false;
    document.getElementById('endobj').disabled = false;
    document.getElementById('computeButton').disabled = false;
  }
};

const parseForTime = (value, id, rowId) => {
  // Get current frame from input field (either start time or end time)
  let frameFromInputText = JSON.parse(value).lct;
  if (typeof frameFromInputText !== 'undefined') {
    // Get the framerate
    let frameRate = parseInt(document.getElementById('framerate').value);
    // Calculate the frame
    let frameFromObj = (time, fps) => Math.floor(time * fps) / fps; //round to the nearest frame
    let finalFrame = frameFromObj(frameFromInputText, frameRate);
    // Update the DOM
    document.getElementById(id).value = `${finalFrame}`;

    calculateFramesRow(rowId);
  }
};

const calculateFramesRow = (row) => {
  let frameRate = parseInt(document.getElementById('framerate').value);
  let startFrame = document.getElementById('start' + row).value;
  let endFrame = document.getElementById('end' + row).value;

  if (
    startFrame == '' ||
    endFrame == '' ||
    framerate == ''
  ) {
    return;
  }

  let frames = (endFrame - startFrame) * frameRate;
  document.getElementById('rowTotal' + row).innerHTML = Math.round(frames);

  compute();
};

const addInputRows = () => {
  let table = document.getElementById('input-table');
  table.innerHTML =
    '<tr><td>Hole</td><td>Starting Frame</td><td>Ending Frame</td><td>Frames</td></tr>';

  //let numberOfHoles = event.target.value;
  let numberOfHoles = 18;
  for (var i = 1; i <= numberOfHoles; i++) {
    let row = document.createElement('tr');

    //add column 1: Hole
    let hole = document.createElement('td');
    hole.innerText = i;
    row.appendChild(hole);

    //add column 2: start input
    let startCol = document.createElement('td');
    let startInput = document.createElement('input');
    startInput.type = 'text';
    startInput.id = 'start' + i;
    startInput.className = i;
    startInput.addEventListener(
      'change',
      function () {
        parseForTime(this.value, this.id, this.className);
      },
      false
    );

    startCol.appendChild(startInput);
    row.appendChild(startCol);

    //add column 3: end input
    let endCol = document.createElement('td');
    let endInput = document.createElement('input');
    endInput.type = 'text';
    endInput.id = 'end' + i;
    endInput.className = i;
    endInput.addEventListener(
      'change',
      function () {
        parseForTime(this.value, this.id, this.className);
      },
      false
    );
    endCol.appendChild(endInput);
    row.appendChild(endCol);

    let time = document.createElement('td');
    time.id = 'rowTotal' + i;
    time.innerText = 0;
    row.appendChild(time);

    table.appendChild(row);
  }

  let footer = document.createElement('tr');

  let totalTime = document.createElement('td');
  totalTime.id = 'totalTime';
  totalTime.style = 'text-align: right';
  totalTime.colSpan = '4';

  totalTime.innerText = 0;
  footer.appendChild(totalTime);

  table.appendChild(footer);
};
