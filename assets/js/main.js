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
// Sets the window focus change event based on the browser used
if (typeof document.msHidden !== "undefined") {
  // Internet Explorer
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  // Apple iOS Safari
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
} else {
  // Everything else
  hidden = "hidden";
  visibilityChange = "visibilitychange";
}

// Adds a custom number filter to properly output time elapsed
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
      seconds = '0' + seconds;
    }

    seconds += secondsText;
  }

  return hours + ' ' + minutes + ' ' + seconds;
}

// Handles game pausing on window focus change
function handleWindowFocusChange() {
  if ((startedTimer && !isPaused) || (isPaused && startedTimer && timeElapsed > 0)) {
    toggleTimer();
  }
}

// Resets the board and all variables
function resetBoard(e) {
  stopTimer();

  if (e.target.id == 'reset-button') {
    // If the reset button on the top controls is clicked
    hidePageContent();
    showModal();
  } else {
    // If the restart button on the victory dialog is clicked
    hideModal();
  }

  resetVariables();
  clearAllTiles();
  resetTextDisplays();
  resetStars();
  resetPlayPauseButtons();
}

// Removes all animation classes from the tiles and "flips" them
function clearAllTiles() {
  boardTiles.forEach(function(tile) {
    tile.classList.remove('bounce');
    tile.classList.add('closed');
    tile.firstElementChild.remove();
  });
}

// Resets the number of displayed stars to 3
function resetStars() {
  Array.from(starsDisplay.children).forEach(function(star) {
    star.classList.remove('hidden');
  });
}

// Resets the visibility of the play and pause buttons
function resetPlayPauseButtons() {
  if (pauseButton.classList.contains('hidden') || playButton.classList.conains('hidden')) {
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
  }
}

// Increases the moves and handles star removal when the conditions are met
function increaseMoves() {
  moves++;
  movesCounter.innerText = moves;

  if (moves === firstStarRemovalMoves || moves === secondStarRemovalMoves) {
    // Removes a star when the star removal condition is met
    removeStar();
  }
}

// Resets all variables to their initial values
function resetVariables() {
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
  calculatedScore = 0;
  startedTimer = null;
}

// Resets all dynamic text displays to their initial values
function resetTextDisplays() {
  victoryScreen.classList.add('hidden');
  victoryText.innerText = '';
  victoryScore.innerText = '';
  introScreen.classList.remove('hidden');
  movesCounter.innerText = moves;
  time.innerText = '';
}

// Initializes tiles and assigns a random icon to each one
function initializeTiles() {
  tileIconIndex = Math.round(Math.random() * (tileIconsCount - tileIconsToGet)); // Randomly pick icons to get
  icons = tileIcons.slice(tileIconIndex, (tileIconIndex + tileIconsToGet)); // Create a temporary icons pool

  // Assigns an icon dynamically for each board tile
  boardTiles.forEach(function(tile) {
    numberOfIcons = icons.length > 1 ? icons.length - 1 : 0;
    iconIndex = Math.round(Math.random() * numberOfIcons);
    iconName = icons[iconIndex];

    newTileIcon = document.createElement('span'); // Create the board tile icon element
    newTileIcon.classList.add('fa', 'fa-' + iconName); // Assign an icon class to the tile icon element

    // Counts how many times an icon has been put on the board
    insertedIcons[iconName] = insertedIcons[iconName] === undefined ? 1 : insertedIcons[iconName] + 1;

    // If 2 of the same icon exist on the board, remove the icon from the temporary icon pool
    if (insertedIcons[iconName] === 2) {
      icons.splice(iconIndex, 1);
    }

    // Add the icon to the board tile
    tile.appendChild(newTileIcon);
    tile.classList.add('closed');
  });
}

// Handles starting the game, resetting the variables and initializing the tiles
function startGame() {
  if (!modal.classList.contains('hidden')) {
    // Hides the modal if it's visible
    hideModal();
  }

  if (pageContent.classList.contains('invisible')) {
    // Shows the game content if it's hidden
    showPageContent();
  }

  resetVariables();
  initializeTiles();
  startTimer();
}

// Completely resets the game and board
function resetGame(e) {
  resetBoard(e);

  if (e.target.id == 'restart-game-button') {
    // If the reset button on the victory screen is pressed, automatically start the game
    startGame();
  }
}

// Handles starting the timer
function startTimer() {
  gameInfo.classList.remove('hidden');
  gameInfo.classList.remove('invisible');

  timer.classList.remove('invisible');
  // Set a startedTimer interval for easy timer manipulation
  startedTimer = setInterval(incrementTimer, 1000);
}

// Handles stopping the timer and clearing its set interval
function stopTimer() {
  // Remove the interval for the timer so it can be started again on game restart
  clearInterval(startedTimer);

  pauseButton.classList.add('hidden');
  playButton.classList.add('hidden');
}

// Handles removing of stars when the conditions are met
function removeStar() {
  if (stars > 1) {
    // If there are more than 1 star, decrese the stars count and hide a star in the game
    stars--;
    starsDisplay.children[stars - 1].classList.add('hidden');
  }
}

// Increases the timer each second and displays it in its proper element's content
function incrementTimer() {
  if (!isPaused) {
    timeElapsed++;
    time.innerText = timeElapsed.toTimeElapsed();
  }
}

// Pauses and unpauses the timer based on isPaused toggle
function toggleTimer() {
  isPaused = !isPaused;

  pauseButton.classList.toggle('hidden');
  playButton.classList.toggle('hidden');
}

// Compares the 2 open tiles if they match or not
// Counts the number of correct tiles
// If all tiles are flipped, the game is won
function compareTiles() {
  let firstTileName = openTiles[0].firstElementChild.classList[1];
  let secondTileName = openTiles[1].firstElementChild.classList[1];

  increaseMoves();

  // Compares the open tiles' icons
  if (firstTileName === secondTileName) {
    // Tiles match so we increase the number of correctly guessed tiles
    correctTiles++;

    // Animates the correct tile guess
    openTiles.forEach(function(tile) {
      tile.classList.add('bounce');
    });

    // If all tiles are guessed correctly, the game is won
    // Displays the victory dialog
    if (correctTiles === boardTiles.length / 2) {
      gameWon();
    }

    // Resets variables for tile matching
    openTiles = [];
    openTilesCount = 0;
  } else {
    // Tiles do not match
    // Animates the wrong tile guess
    openTiles.forEach(function(tile) {
      tile.classList.add('shake');
    });

    // "Flips" back the open tiles
    hideOpenTiles();
  }
}

// Handles game won functions
// Stops the timer, calculates the score and shows the victory modal with
// informative text based on the player's performance
function gameWon() {
  stopTimer();
  calculatedScore = (stars * 3000) - (timeElapsed * 10);
  score = calculatedScore < 0 ? 0 : calculatedScore;
  showModal();
  introScreen.classList.add('hidden');
  victoryText.innerText = 'Congratulations! You won! It took you ' + moves + ' moves, ' + timeElapsed.toTimeElapsed() + ' and you finished with ' + stars + ' stars!';
  victoryScore.innerText = 'Your final score is ' + score;
  victoryScreen.classList.remove('hidden');
}

// Hides open tiles and removes all animation classes from them
function hideOpenTiles() {
  openTiles.forEach(function(tile) {
    setTimeout(function() {
      tile.classList.add('closed');
      tile.classList.remove('shake');

      openTiles = [];
      openTilesCount = 0;
    }, 1000);
  });
}

// Handles opening of a tile
function openTile(tile) {
  tile.classList.toggle('closed');

  openTiles.push(tile);

  openTilesCount++;
}

// Handles tile "flipping" logic
function handleTileClick(e) {
  if ((e.target.classList.contains('closed')) && (openTiles.length === 0 || openTiles.length === 1) && !isPaused) {
    // If a tile is closed, and there's no more than 1 other open tile and the game isn't pased, "flip" the tile
    openTile(e.target);

    // If there are now 2 open tiles, compare them
    if (openTilesCount === 2) {
      compareTiles();
    }
  }
}

// Animates displaying of the modal
function showModal() {
  // Cancel the animation for showing the content if any
  if (showContentTrigger) {
    clearTimeout(showContentTrigger);
  }

  // Cancel the animation of hiding the modal if any
  if (hideModalTrigger) {
    modal.classList.remove('slidedown');
    clearTimeout(hideModalTrigger);
  }

  modal.classList.add('slideup');
  modal.classList.remove('hidden');

  showModalTrigger = setTimeout(function() {
    modal.classList.remove('slideup');
  }, 1500);
}

// Animates hiding of the modal
function hideModal() {
  // Cancel the animation for hiding the content if any
  if (hideContentTrigger) {
    clearTimeout(hideContentTrigger);
  }

  // Cancel the animation of showing the modal if any
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

// Animates displaying of the game and game information
function showPageContent() {
  // Cancel the animation for hiding the content if any
  if (hideContentTrigger) {
    pageContent.classList.remove('fadeout');
    gameInfo.classList.remove('fadeout');
    clearTimeout(hideContentTrigger);
  }

  // Cancel the animation of showing the modal if any
  if (showModalTrigger) {
    clearTimeout(showModalTrigger);
  }

  pageContent.classList.add('fadein');
  gameInfo.classList.add('fadein');
  pageContent.classList.remove('invisible', 'hidden');
  gameInfo.classList.remove('invisible', 'hidden');

  showContentTrigger = setTimeout(function() {
    pageContent.classList.remove('fadein');
    gameInfo.classList.remove('fadein');
  }, 1500);
}

// Animates hiding of the game and game information
function hidePageContent() {
  // Cancel the animation for showing the content if any
  if (showContentTrigger) {
    pageContent.classList.remove('fadein');
    gameInfo.classList.remove('fadein');
    clearTimeout(showContentTrigger);
  }

  // Cancel the animation of hiding the modal if any
  if (hideModal) {
    clearTimeout(hideModal);
  }

  pageContent.classList.add('fadeout');
  gameInfo.classList.add('fadeout');

  hideContentTrigger = setTimeout(function() {
    pageContent.classList.add('invisible');
    gameInfo.classList.add('invisible');
    pageContent.classList.remove('fadeout');
    gameInfo.classList.remove('fadeout');
  }, 1500);
}

// Handle pause button clicks
pauseButton.addEventListener('click', toggleTimer);

// Handle play button clicks
playButton.addEventListener('click', toggleTimer);

// Handle reset button clicks
resetButton.addEventListener('click', resetGame);

// Handle restart button clicks (on the victory screen)
restartGameButton.addEventListener('click', resetGame);

// Handle board tile clicks
mainBoard.addEventListener('click', handleTileClick);

// Handle start game button clicks
startGameButton.addEventListener('click', startGame);

// Handle page focus changes
document.addEventListener(visibilityChange, handleWindowFocusChange);
