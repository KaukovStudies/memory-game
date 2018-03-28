const pageContent = document.querySelector('#page-content');
const boardTiles = document.querySelectorAll('.board-tile');
const mainBoard = document.querySelector('#main-board');
const victoryDialog = document.querySelector('#victory-dialog');
const victoryText = document.querySelector('#victory-text');
const victoryScore = document.querySelector('#victory-score');
const gameInfo = document.querySelector('#game-info');
const starsDisplay = document.querySelector('#stars');
const movesCounter = document.querySelector('#moves');
const playerScore = document.querySelector('#player-score');
const timer = document.querySelector('#timer');
const time = document.querySelector('#time-elapsed');
const resetButton = document.querySelector('#reset-button');
const pauseButton = document.querySelector('#pause-button');
const playButton = document.querySelector('#play-button');
const startGameButton = document.querySelector('#start-game-button');
const restartGameButton = document.querySelector('#restart-game-button');
const modal = document.querySelector('#modal');
const introScreen = document.querySelector('#intro-screen');
const victoryScreen = document.querySelector('#victory-screen');
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
  "basketball-ball"
];

const tileIconsToGet = boardTiles.length / 2;
const tileIconsCount = tileIcons.length;

let tileIconIndex,
    openTilesCount,
    openTiles,
    correctTiles,
    calculatedScore,
    score,
    stars,
    moves,
    timeElapsed,
    startedTimer,
    isPaused,
    insertedIcons,
    icons,
    numberOfIcons,
    iconIndex,
    iconName,
    newTileIcon,
    showModalTrigger,
    hideModalTrigger,
    showContentTrigger,
    hideContentTrigger,
    hidden,
    visibilityChange;

// Taken from MDN
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

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

function handleWindowFocusChange() {
  if (startedTimer && !isPaused) {
    toggleTimer();
  }
}

function resetBoard() {
  showModal();
  hidePageContent();
  // reset all scores and board tile states
  boardTiles.forEach(function(tile) {
    tile.classList.add('closed');
    tile.firstElementChild.remove();
  });

  victoryScreen.classList.add('hidden');
  victoryText.innerText = '';
  victoryScore.innerText = '';
  introScreen.classList.remove('hidden');
  mainBoard.classList.remove('hidden');

  isPaused = false;
  moves = 0;
  stars = 3;
  calculatedScore = 0;
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
  gameInfo.classList.remove('hidden');

  if (pauseButton.classList.contains('hidden') || playButton.classList.conains('hidden')) {
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
  }

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
  gameInfo.classList.remove('hidden');
  gameInfo.classList.remove('invisible');

  timer.classList.remove('invisible');
  startedTimer = setInterval(incrementTimer, 1000);

}

function stopTimer() {
  clearInterval(startedTimer);

  pauseButton.classList.add('hidden');
  playButton.classList.add('hidden');
}

function removeStar() {
  if (stars > 1) {
    stars--;
    starsDisplay.children[stars - 1].classList.add('hidden'); // TODO: test with invisible class
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
        correctTiles++;

        if (correctTiles === boardTiles.length / 2) {
          stopTimer();
          calculatedScore = (stars * 3000) - (timeElapsed * 10);
          score = calculatedScore < 0 ? 0 : calculatedScore;
          modal.classList.add('transparent-dark-bg')
          showModal();
          introScreen.classList.add('hidden');
          victoryText.innerText = `Congratulations! You won! It took you ${moves} moves, ${timeElapsed.toTimeElapsed()} and you finished with ${stars} stars!`;
          victoryScore.innerText = `Your final score is ${score}`;
          victoryScreen.classList.remove('hidden');
        }

        openTiles = [];
        openTilesCount = 0;
      } else {
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

function showModal() {
  if (showContentTrigger) {
    clearTimeout(showContentTrigger);
  }

  if (hideModalTrigger) {
    modal.classList.remove('slidedown');
    clearTimeout(hideModalTrigger);
  }

  modal.classList.add('slideup');
  modal.classList.remove('hidden', 'invisible');

  showModalTrigger = setTimeout(function() {
    modal.classList.remove('slideup');
  }, 1500);
}

function hideModal() {
  if (hideContentTrigger) {
    clearTimeout(hideContentTrigger);
  }

  if (showModalTrigger) {
    modal.classList.remove('slideup');
    clearTimeout(showModalTrigger);
  }

  modal.classList.add('slidedown');

  hideModalTrigger = setTimeout(function() {
    modal.classList.add('hidden');
    modal.classList.remove('slidedown');
  }, 1500);
}

function showPageContent() {
  if (hideContentTrigger) {
    pageContent.classList.remove('fadeout');
    clearTimeout(hideContentTrigger);
  }

  if (showModalTrigger) {
    clearTimeout(showModalTrigger);
  }

  pageContent.classList.add('fadein');
  pageContent.classList.remove('invisible', 'hidden');

  showContentTrigger = setTimeout(function() {
    pageContent.classList.remove('fadein');
  }, 1500);
}

function hidePageContent() {
  if (showContentTrigger) {
    pageContent.classList.remove('fadein');
    clearTimeout(showContentTrigger);
  }

  if (hideModal) {
    clearTimeout(hideModal);
  }

  pageContent.classList.add('fadeout');

  hideContentTrigger = setTimeout(function() {
    pageContent.classList.add('invisible');
    pageContent.classList.remove('fadeout');
  }, 1500);
}

pauseButton.addEventListener('click', toggleTimer);

playButton.addEventListener('click', toggleTimer);

resetButton.addEventListener('click', resetBoard);

restartGameButton.addEventListener('click', resetBoard);

mainBoard.addEventListener('click', setUpMainBoard);

startGameButton.addEventListener('click', function(e) {
  hideModal();
  showPageContent();
  startTimer();
});

document.addEventListener(visibilityChange, handleWindowFocusChange);

initializeGame();
