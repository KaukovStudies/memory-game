const boardTiles = document.querySelectorAll('.board-tile');
const mainBoard = document.querySelector('.main-board');

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

function initializeBoard() {
  // reset all scores and board tile states
  boardTiles.forEach(function (tile) {
    if (!tile.classList.contains('closed')) {
      tile.classList.toggle('closed');
    }
  });
}

function fillTiles() {
  const insertedIcons = {};
  const icons = tileIcons;

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
  });
}



mainBoard.addEventListener('click', function (e) {
  // TODO:
  // If a tile is open, don't allow closing it until another is opened
  // and they are checked for matching tiles

  if (e.target.classList.contains('fa')) {
    // if a player clicks on the icon, don't toggle the class on the icon,
    // but on its parent - the board tile
    e.target.parentElement.classList.toggle('closed');
  } else {
    e.target.classList.toggle('closed');
  }
});

fillTiles();

/*
 * TODO:
 * Make a function which renders all board tiles, adds an icon and shuffles them
 * Add dynamic board size selection (bonus)
 */
