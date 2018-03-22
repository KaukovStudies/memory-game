const boardTiles = document.querySelectorAll('.board-tile');
const mainBoard = document.querySelector('#main-board');
const gameInfo = document.querySelector('#game-info');
const starsDisplay = document.querySelector('#stars');
const movesCounter = document.querySelector('#moves');
const playerScore = document.querySelector('#player-score');
const timer = document.querySelector('#timer');
const time = document.querySelector('#time-elapsed');
const resetButton = document.querySelector('#reset-button');
const pauseButton = document.querySelector('#pause-button');
const playButton = document.querySelector('#play-button');
const stopButton = document.querySelector('#stop-button');
const secondsText = 's';
const minutesText = 'm';
const hoursText = 'h';
const firstStarRemovalMoves = 20;
const secondStarRemovalMoves = 35;

const tileIcons = [
  "address-book",
  "align-justify",
  "american-sign-language-interpreting",
  "angle-double-right",
  "angle-right",
  "arrow-circle-left",
  "arrow-left",
  "at",
  "ban",
  "baseball-ball",
  "battery-full",
  "bed",
  "bicycle",
  "bold",
  "bookmark",
  "braille",
  "bullhorn",
  "calendar",
  "calendar-plus",
  "car",
  "caret-square-down",
  "caret-up",
  "chart-area",
  "check",
  "chess-bishop",
  "chess-pawn",
  "chevron-circle-left",
  "chevron-left",
  "circle",
  "clipboard-list",
  "cloud",
  "code-branch",
  "columns",
  "compass",
  "credit-card",
  "cubes",
  "desktop",
  "dolly-flatbed",
  "eject",
  "envelope-open",
  "expand",
  "eye",
  "fast-forward",
  "file",
  "file-code",
  "file-powerpoint",
  "filter",
  "align-center",
  "align-right",
  "anchor",
  "angle-left",
  "archive",
  "arrow-down",
  "arrow-up",
  "balance-scale",
  "barcode",
  "basketball-ball",
  "battery-three-quarters",
  "bell",
  "binoculars",
  "book",
  "box",
  "briefcase",
  "calculator",
  "calendar-check",
  "calendar-times",
  "caret-right",
  "caret-square-right",
  "cart-arrow-down",
  "chart-pie",
  "check-square",
  "chess-board",
  "chevron-circle-down",
  "chevron-circle-up",
  "chevron-right",
  "clipboard-check",
  "clone",
  "cogs",
  "compress",
  "cube",
  "align-left",
  "angle-double-down",
  "arrow-alt-circle-left",
  "arrow-circle-right",
  "asterisk",
  "battery-quarter",
  "bell-slash",
  "bowling-ball",
  "bug",
  "caret-down",
  "certificate",
  "chess-rook",
  "chevron-down",
  "clock",
  "cloud-upload-alt",
  "crop",
  "database",
  "dolly",
  "envelope-square",
  "exclamation-circle",
  "external-link-square-alt",
  "file-alt",
  "file-image",
  "film",
  "flag",
  "font",
  "gamepad",
  "glass-martini",
  "hand-lizard",
  "hand-point-right",
  "hand-spock",
  "headphones",
  "home",
  "hourglass-half",
  "band-aid",
  "bolt",
  "gem",
  "basketball-ball",
];

const tileIconsToGet = boardTiles.length / 2; // TODO: implement increasing board size
const tileIconsCount = tileIcons.length;
let tileIconIndex;

let openTilesCount;
let openTiles;

let correctTiles;
let score; // for future score counting
let stars;
let moves;
let timeElapsed;
let startedTimer;
let isPaused;

let insertedIcons;
let icons;
let numberOfIcons;
let iconIndex;
let iconName;
let newTileIcon;

Number.prototype.toTimeElapsed = function() {
  let parsedTime = parseInt(this, 10);
  let hours = Math.floor(parsedTime / 3600);
  let minutes = Math.floor((parsedTime - (hours * 3600)) / 60);
  let seconds = parsedTime - (hours * 3600) - (minutes * 60);

  if (hours === 0) {
    hours = '';
  } else {
    hours = hours + hoursText;
  }

  if (minutes === 0) {
    minutes = '';
  } else {
    minutes = minutes + minutesText;
  }

  if (seconds === 0) {
    seconds = '';
  } else {
    if (seconds < 10 && minutes > 0) {
      seconds = `0${seconds}`;
    }

    seconds += secondsText;
  }

  return `${hours} ${minutes} ${seconds}`;
}

function resetBoard() {
  // reset all scores and board tile states
  boardTiles.forEach(function(tile) {
    tile.classList.add('closed');
    tile.firstElementChild.remove();
  });

  isPaused = false;
  moves = 0;
  stars = 3;
  score = 0;
  correctTiles = 0;
  stopTimer();
  timeElapsed = 0;
  openTilesCount = 0;
  startedTimer = null;

  time.innerText = '';

  Array.from(starsDisplay.children).forEach(function(star) {
    star.classList.remove('hidden');
  });

  gameInfo.classList.add('invisible');

  initializeGame();
}

function increaseMoves() {
  moves++;
  movesCounter.innerText = moves;

  if (moves === firstStarRemovalMoves || moves === secondStarRemovalMoves) {
    removeStar();
  }
}

function initializeGame() {
  tileIconIndex = 0;
  openTilesCount = 0;
  openTiles = [];
  correctTiles = 0;
  score = 0;
  stars = 3;
  moves = 0;
  timeElapsed = 0;
  isPaused = false;
  insertedIcons = {};
  tileIconIndex = Math.round(Math.random() * (tileIconsCount - tileIconsToGet));
  icons = tileIcons.slice(tileIconIndex, (tileIconIndex + tileIconsToGet));

  movesCounter.innerText = moves;

  boardTiles.forEach(function(tile) {
    numberOfIcons = icons.length > 1 ? icons.length - 1 : 0;
    iconIndex = Math.round(Math.random() * numberOfIcons);
    iconName = icons[iconIndex];

    newTileIcon = document.createElement('span');
    newTileIcon.classList.add('fa', `fa-${iconName}`);

    insertedIcons[iconName] = insertedIcons[iconName] === undefined ? 1 : insertedIcons[iconName] + 1;

    if (insertedIcons[iconName] === 2) {
      icons.splice(iconIndex, 1);
    }

    tile.appendChild(newTileIcon);
    tile.classList.add('closed');
  });
}

function startTimer() {
  gameInfo.classList.remove('invisible');

  startedTimer = setInterval(incrementTimer, 1000);

  timer.classList.remove('invisible');
}

function stopTimer() { clearInterval(startedTimer); }

function removeStar() {
  if (stars > 1) {
    stars--;
    starsDisplay.children[stars - 1].classList.add('hidden');
  }
}

function incrementTimer() {
  if (!isPaused) {
    timeElapsed++;
    time.innerText = timeElapsed.toTimeElapsed();
  }
}

function toggleTimer() {
  isPaused = !isPaused;

  pauseButton.classList.toggle('hidden');
  playButton.classList.toggle('hidden');
}

function setUpMainBoard(e) {
  if ((e.target.classList.contains('closed')) && (openTiles.length === 0 || openTiles.length === 1) && !isPaused) {
    e.target.classList.toggle('closed');

    openTiles.push(e.target);

    let tileIcon = e.target.firstElementChild.classList[1];

    openTilesCount++;

    if (openTilesCount === 2) {
      if (!startedTimer) {
        startTimer();
      }

      let firstTileName = openTiles[0].firstElementChild.classList[1];
      let secondTileName = openTiles[1].firstElementChild.classList[1];

      increaseMoves();

      if (firstTileName === secondTileName) {
        console.log('Tiles match. Congratulations!');

        correctTiles++;

        if (correctTiles === boardTiles.length / 2) {
          console.log(`You win the game! It took you ${moves} moves`);
          stopTimer();
        }

        openTiles = [];
        openTilesCount = 0;
      } else {
        console.log('Tiles do not match. Please try again!');

        openTiles.forEach(function(tile) {
          setTimeout(function() {
            tile.classList.toggle('closed');

            openTiles = [];
            openTilesCount = 0;
          }, 1000);
        });
      }
    }
  }
}

pauseButton.addEventListener('click', toggleTimer);

playButton.addEventListener('click', toggleTimer);

resetButton.addEventListener('click', resetBoard);

mainBoard.addEventListener('click', setUpMainBoard);

initializeGame();

/*
 * TODO:
 * Make a function which renders all board tiles, adds an icon and shuffles them
 * Add dynamic board size selection (bonus)
 * Maybe levels ?! (bonus)
 */
