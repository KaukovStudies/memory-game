const boardTiles = document.querySelectorAll('.board-tile');
const mainBoard = document.querySelector('.main-board');

function initializeBoard() {
  // reset all scores and board tile states
}

boardTiles.forEach(function (tile) {
  if (!tile.classList.contains('closed')) {
    tile.classList.toggle('closed');
  }
});

mainBoard.addEventListener('click', function (e) {
  // TODO:
  // If a tile is open, don't allow closing it until another is opened
  // and they are checked for matching tiles

  if (e.target.classList.contains('fa')) {
    e.target.parentElement.classList.toggle('closed');
  } else {
    e.target.classList.toggle('closed');
  }
});

/*
 * TODO:
 * Make a function which renders all board tiles, adds an icon and shuffles them
 */
