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
    } else {
      console.log(
        `Square at row ${row}, column ${column} is already occupied. Choose a different square.`
      );
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

  let isSame = false;
  const checkRows = () => {
    const board = gameBoard.getBoard();
    board.map((row) => {
      const rowVals = row.map((cell) => cell.getValue());
      // console.log(getActivePlayer().marker);
      const sameValsOne = rowVals.every(
        (value) => value === getActivePlayer().marker
      );
      const sameValsTwo = rowVals.every(
        (value) => value === getActivePlayer().marker
      );

      if (sameValsOne || sameValsTwo) {
        isSame = true;
      }
    });
  };

  const checkColumns = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const colVals = [];
      for (let j = 0; j < row.length; j++) {
        colVals.push(board[j][i].getValue());
      }
      // console.log(colVals);

      const sameValsOne = colVals.every(
        (value) => value === getActivePlayer().marker
      );
      const sameValsTwo = colVals.every(
        (value) => value === getActivePlayer().marker
      );

      if (sameValsOne || sameValsTwo) {
        isSame = true;
      }
    }
  };

  

  // const checkValues = () => {
  //   const board = gameBoard.getBoard();
  //   let result = false;
  //   if (checkRows(board) || checkColumns(board) || checkDiagonals(board)) {
  //     result = true;
  //   }
  //   return result;
  // };

  // const declareWinner = () => {
  //   checkRows()
  //   if (getResult()) {
  //     console.log(`${getActivePlayer().name} has won the game.`);
  //   }
  // };

  // TODO: run declareWinner after every turn

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } marking the square in row: ${row} column: ${column}`
    );
    gameBoard.updateMarker(row, column, getActivePlayer().marker);

    printNewRound();
    // TODO: run declareWinner here

    checkRows();
    checkColumns();
    // console.log(isSame);
    if (isSame) {
      console.log(`${getActivePlayer().name} has won`);
    }
    switchPlayerTurn();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  printNewRound();

  return { playRound };
})();

gameController.playRound(2, 1);
// gameController.playRound(1, 2);
// gameController.playRound(1, 1);
// gameController.playRound(2, 2);
// gameController.playRound(0, 0);
// gameController.playRound(0, 2);
// gameController.playRound(2, 1);
// gameController.playRound(1, 0);

// TODO: When a player chooses the square already occupied don't switch the turn. Log a message showing the error and tell player to select a different square

// TODO: Run showWinner() function if any player manages to win. Log a message saying 'Game is over! The winner is xxxxx.'

// TODO: Run gameDraw() function if all squares are selected and there's no winner. Log a message saying 'the game is over and there's no winner!'
