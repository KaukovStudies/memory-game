const boardTiles = document.querySelectorAll('.board-tile');
const mainBoard = document.querySelector('.main-board');
const movesCounter = document.querySelector('.moves');
const playerScore = document.querySelector('.player-score');
const timer = document.querySelector('.timer');
const time = document.querySelector('.time-elapsed');
const secondsText = 's';
const minutesText = 'm';
const hoursText = 'h';

const tileIcons = [
  `fa-band-aid`,
  `fa-anchor`,
  `fa-balance-scale`,
  `fa-arrow-down`,
  `fa-eye`,
  `fa-bolt`,
  `fa-gem`,
  `fa-basketball-ball`
];

let openTilesCount = 0;
let openTiles = [];

let correctTiles = 0;
let score = 0; // for future score counting
let stars = 3; // for future star counting
let moves = 0;
let timeStarted;
let timeElapsed = 0;
let startedTimer;

Number.prototype.toTimeElapsed = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (seconds < 10 && minutes > 0) {seconds = "0"+seconds;}

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
      seconds = seconds + secondsText;
    }

    return `${hours} ${minutes} ${seconds}`;
}

function resetBoard() {
  // reset all scores and board tile states
  boardTiles.forEach(function (tile) {
    if (!tile.classList.contains('closed')) {
      tile.classList.toggle('closed');
    }
  });
}

function increaseMoves() {
  moves++;
  movesCounter.innerText = moves;
}

function initializeGame() {
  const insertedIcons = {};
  const icons = tileIcons;

  movesCounter.innerText = moves;

  boardTiles.forEach(function (tile) {
    const numberOfIcons = icons.length > 1 ? icons.length - 1 : 0;
    const iconIndex = Math.round(Math.random() * numberOfIcons);
    const iconName = icons[iconIndex];

    const newTileIcon = document.createElement('span');
    newTileIcon.classList.add('fa', iconName);

    insertedIcons[iconName] = insertedIcons[iconName] === undefined ? 1 : insertedIcons[iconName] + 1;

    if (insertedIcons[iconName] === 2) {
      icons.splice(iconIndex, 1);
    }

    tile.appendChild(newTileIcon);
    tile.classList.toggle('closed');
  });
}

function startTimer() {
  startedTimer = setInterval(incrementTimer, 1000);

  timer.classList.remove('invisible');
}

function stopTimer() {
  clearInterval(startedTimer);
}

function incrementTimer() {
  timeElapsed += 1;

  time.innerText = timeElapsed.toTimeElapsed();
}

mainBoard.addEventListener('click', function (e) {
  if ( (e.target.classList.contains('closed')) && (openTiles.length === 0 || openTiles.length === 1) ) {
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

        openTiles.forEach(function (tile) {
          setTimeout(function () {
            tile.classList.toggle('closed');

            openTiles = [];
            openTilesCount = 0;
          }, 1000);
        });
      }
    }
  }
});

initializeGame();

clearInterval(startedTimer);

/*
 * TODO:
 * Make a function which renders all board tiles, adds an icon and shuffles them
 * Add dynamic board size selection (bonus)
 * Maybe levels ?! (bonus)
 */
