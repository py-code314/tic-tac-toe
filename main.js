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

  const checkForZeroes = () => {
    const board = gameBoard.getBoard();
    return board.some((row) => row.some((cell) => cell.getValue() === 0));
  };

  const hasZeroes = () => checkForZeroes();

  return { checkRows, checkColumns, checkDiagonals, hasZeroes };
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

  let winMessage = '';
  function checkForWinner() {
    const winner =
      checkValues.checkRows() ||
      checkValues.checkColumns() ||
      checkValues.checkDiagonals();

    if (winner) {
      console.log(`${getActivePlayer().name} has won`);
      winMessage = `${getActivePlayer().name} has won`;
    } else if (!winner && !checkValues.hasZeroes()) {
      console.log(`Game is a draw`);
      winMessage = `Game is a draw`;
    } else {
      switchPlayerTurn();
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  }

  const getWinner = () => winMessage;

  let errorMessage = '';

  const updateMarkerSuccess = (row, column) => {
    const success = gameBoard.updateMarker(
      row,
      column,
      getActivePlayer().marker
    );

    // Don't allow player to mark the square already occupied
    if (success) {
      printNewRound();
      checkForWinner();
      errorMessage = '';
    } else {
      // Show error to player
      console.log(
        `Square at row ${row}, column ${column} is already occupied. Choose a different square.`
      );
      errorMessage = `Please choose a different square.`;
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  const getError = () => errorMessage;

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } marking the square in row: ${row} column: ${column}`
    );

    updateMarkerSuccess(row, column);
  };

  printNewRound();
  console.log(`${getActivePlayer().name}'s turn.`);

  return {
    playRound,
    checkForWinner,
    getWinner,
    getError,
    getActivePlayer,
    updateMarkerSuccess,
    getBoard: gameBoard.getBoard,
  };
})();

function screenController() {
  // Get html elements
  const boardContainer = document.querySelector('.board');
  const playerTurn = document.querySelector('.turn__msg');

  const updateScreen = () => {
    // Clear the board after each turn
    boardContainer.textContent = '';

    // Get board data and active player's name after each turn
    const activePlayer = gameController.getActivePlayer();
    const board = gameController.getBoard();

    // Display player's turn
    playerTurn.textContent = `${activePlayer.name}'s turn...`;

    // Render board
    let html = '';
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        html += `
      <button class="cell" data-row="${rowIndex}" data-column="${columnIndex}">${cell.getValue()}</button>
    `;
      });
    });
    boardContainer.innerHTML = html;
  };

  // Handle button click
  function handleBtnClick(event) {
    const rowNum = event.target.dataset.row;
    const colNum = event.target.dataset.column;

    // Make sure user clicks inside a square
    if (!rowNum || !colNum) return;

    gameController.playRound(rowNum, colNum);
    updateScreen();
    showMessage();
  }

  boardContainer.addEventListener('click', handleBtnClick);

  function showMessage() {
    const winnerMsg = document.querySelector('.winner__msg');
    const errorMsg = document.querySelector('.error__msg');

    // Show error message
    const error = gameController.getError();
    console.log(error);
    errorMsg.textContent = error;

    // Show winning message
    const winner = gameController.getWinner();
    console.log(winner);
    winnerMsg.textContent = winner;
  }

  function getNames() {
    // Get inputs
    let player1Input = document.querySelector('.player1');
    let player2Input = document.querySelector('.player2');
    // console.log(player1Input, player2Input);

    // Get name elements to show names
    const player1Name = document.querySelector('.players__one');
    const player2Name = document.querySelector('.players__two');

    player1Name.textContent = player1Input.value;
    player2Name.textContent = player2Input.value;

    player1Input.value = '';
    player2Input.value = ''
  }
  // Add event listener for Submit button
  document.querySelector('#form').addEventListener('click', (event) => {
    event.preventDefault();
    getNames();
  });

  document.querySelector('#form').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      getNames();
      player1Input = '';
      player2Input = '';
    }
  });

  // Initial render
  updateScreen();
}

screenController();

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

// Check for zeroes
// gameController.playRound(0, 0);
// gameController.playRound(0, 1);
// gameController.playRound(1, 0);
// gameController.playRound(2, 0);
// gameController.playRound(1, 1);
// gameController.playRound(1, 2);
// gameController.playRound(2, 1);
// gameController.playRound(2, 2);
// gameController.playRound(0, 2);
