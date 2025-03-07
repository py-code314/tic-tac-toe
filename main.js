const gameBoard = (function () {
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

  // Get board
  const getBoard = () => board;

  // Update square value with Marker when a play has been made
  const updateMarker = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addMarker(player);
      return true;
    } else {
      // console.log(
      //   `Square at row ${row}, column ${column} is already occupied. Choose a different square.`
      // );
      return false;
    }
  };

  // Print board to console
  const printBoard = () => {
    const squares = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(squares);
  };

  return { getBoard, printBoard, updateMarker };
})();

// gameBoard()

function square() {
  let value = 0;

  // Update value of square
  const addMarker = (player) => {
    value = player;
  };

  // Get value of square
  const getValue = () => value;

  return { getValue, addMarker };
}

const checkValues = (function () {
  const board = gameBoard.getBoard();

  // Loop through every row and check the values are same
  const checkRows = () => {
    let sameValues = false;
    const rowsCheck = board.map((row) => {
      const rowValues = row.map((cell) => cell.getValue());
      const allSame = rowValues.every(
        (value) => value !== 0 && value === rowValues[0]
      );

      if (allSame) {
        sameValues = true;
      }
    });

    return sameValues;
  };

  // Loop through every column and check the values are same
  const checkColumns = () => {
    for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
      const columnValues = board.map((row) => row[columnIndex].getValue());

      const allSame = columnValues.every(
        (value) => value !== 0 && value === columnValues[0]
      );

      if (allSame) {
        return true;
      }
    }
  };

  // Check the squares diagonally for same values
  const checkDiagonals = () => {
    // const board = gameBoard.getBoard();
    const leftToRightDiagonal = [];
    const rightToLeftDiagonal = [];

    for (let i = 0; i < board.length; i++) {
      leftToRightDiagonal.push(board[i][i].getValue());
      rightToLeftDiagonal.push(board[i][board.length - 1 - i].getValue());
    }

    const isLeftToRightDiagonalSame = leftToRightDiagonal.every(
      (value) => value !== 0 && value === leftToRightDiagonal[0]
    );
    const isRightToLeftDiagonalSame = rightToLeftDiagonal.every(
      (value) => value !== 0 && value === rightToLeftDiagonal[0]
    );

    if (isLeftToRightDiagonalSame || isRightToLeftDiagonalSame) {
      return true;
    }
  };

  return { checkRows, checkColumns, checkDiagonals };
})();

const gameController = (function (
  player1Name = 'Player 1',
  player2Name = 'Player 2'
) {
  // Create players
  const players = [
    {
      name: player1Name,
      marker: 1,
    },
    {
      name: player2Name,
      marker: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
    // console.log(`${getActivePlayer().name}'s turn.`);
  };

  function checkForWinner() {
    const winner =
      checkValues.checkRows() ||
      checkValues.checkColumns() ||
      checkValues.checkDiagonals();

    if (winner) {
      console.log(`${getActivePlayer().name} has won`);
    } else {
      switchPlayerTurn();
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  }

  const getWinner = () => checkForWinner();

  const updateMarkerSuccess = (row, column) => {
    const success = gameBoard.updateMarker(
      row,
      column,
      getActivePlayer().marker
    );
    console.log(success);

    // Don't allow player to mark the square already occupied
    if (success) {
      printNewRound();
      getWinner();
    } else {
      // Show error to player
      console.log(
        `Square at row ${row}, column ${column} is already occupied. Choose a different square.`
      );
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  }

  

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } marking the square in row: ${row} column: ${column}`
    );

    updateMarkerSuccess(row, column)
  };

  printNewRound();
  console.log(`${getActivePlayer().name}'s turn.`);

  return { playRound, getWinner, updateMarkerSuccess };
})();

// Row wins
// gameController.playRound(0, 0);
// gameController.playRound(1, 0);
// gameController.playRound(0, 1);
// gameController.playRound(1, 1);
// gameController.playRound(0, 2);

// Return false on updateMarker
// gameController.playRound(0, 0);
// gameController.playRound(0, 0);
// gameController.playRound(1, 0);

// Column wins
// gameController.playRound(0, 0);
// gameController.playRound(0, 1);
// gameController.playRound(1, 0);
// gameController.playRound(1, 1);
// gameController.playRound(2, 2);
// gameController.playRound(2, 1);

// Diagonal wins
// gameController.playRound(0, 0);
// gameController.playRound(0, 2);
// gameController.playRound(2, 2);
// gameController.playRound(2, 0);
// gameController.playRound(1, 0);
// gameController.playRound(1, 1);

// TODO: When a player chooses the square already occupied don't switch the turn. Log a message showing the error and tell player to select a different square

// TODO: Run showWinner() function if any player manages to win. Log a message saying 'Game is over! The winner is xxxxx.'

// TODO: Run gameDraw() function if all squares are selected and there's no winner. Log a message saying 'the game is over and there's no winner!'
