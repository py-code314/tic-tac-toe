// Test code below.
// const text = document.querySelector('.text');
// const btn = document.querySelector('.btn');

// btn.addEventListener('click', () => {
//   text.textContent = 'Hello';
// })

function gameBoard() {
  // Create a board
  const rows = 3;
  const columns = 3;
  const board = [];

  // Loop through the rows and columns, add object to each square
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(square());
    }
  }

  // console.log('Board:', board);

  // Get board
  const getBoard = () => board;

  // Update square value with Marker when a play has been made
  const updateMarker = (row, column, player) => {
    // console.log(`Trying to update square at row ${row}, column ${column} with player ${player}`);
    if (board[row][column].getValue() === 0) {
      // console.log(`Updating square at row ${row}, column ${column} with player ${player}`);

      board[row][column].addMarker(player);
    } else {
      console.log(`Square at row ${row}, column ${column} is already occupied. Choose a different square.`);
    }
  };

  // Print board to console
  const printBoard = () => {
    // console.log('Printing board...');
    const squares = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(squares);
    // console.log('Finished printing board.');
  };

  return { getBoard, printBoard, updateMarker };
}

// gameBoard()

function square() {
  let value = 0;

  // Update value of square
  const addMarker = (player) => {
    // console.log(`Attempting to add marker for player ${player}`);
    value = player;
    // console.log(`Marker added for player ${player}`);
  };

  // Get value of square
  const getValue = () => value;

  return { getValue, addMarker };
}

function gameController(player1Name = 'Player 1', player2Name = 'Player 2') {
  // Create players
  const players = [
    {
      name: player1Name,
      marker: 1
    },
    {
      name: player2Name,
      marker: 2
    },
  ]

  // Import gameBoard functions
  const board = gameBoard()

  let activePlayer = players[0]

  const printNewRound = () => {
    board.printBoard()
    console.log(`${getActivePlayer().name}'s turn.`);
  }

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().name} marking the square in row: ${row} column: ${column}`);
    console.log(getActivePlayer().marker);
    board.updateMarker(row, column, getActivePlayer().marker)

    switchPlayerTurn()
    printNewRound()

  }

  printNewRound()
  // playRound()

  return { playRound }
}

const game = gameController()
game.playRound(0, 1)
game.playRound(0, 2)
game.playRound(0, 0);
game.playRound(1, 2);
game.playRound(1, 1);
game.playRound(1, 0);
game.playRound(2, 2);
game.playRound(2, 1);
game.playRound(2, 0);

game.playRound(1, 1);