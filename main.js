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

  // Reset value to 0
  const setValue = () => value = 0

  return { getValue, addMarker, setValue };
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
  let players = [
    {
      name: player1Name,
      marker: 1,
    },
    {
      name: player2Name,
      marker: 2,
    },
  ];

  // const getPlayers = () => players

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  console.log(activePlayer);
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

  const clearWinner = () => {
    winMessage = ''
  }

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

  // Initial render
  printNewRound();
  console.log(`${getActivePlayer().name}'s turn.`);

  return {
    players,
    playRound,
    checkForWinner,
    getWinner,
    clearWinner,
    getError,
    getActivePlayer,
    updateMarkerSuccess,
    getBoard: gameBoard.getBoard,
  };
})();

function screenController() {
  // Get html elements
  const boardContainer = document.querySelector('.display__board');
  const playerTurn = document.querySelector('.display__turn');

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
    // Get row and column numbers
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
    const winnerMsg = document.querySelector('.display__winner');
    const errorMsg = document.querySelector('.display__error');

    //  const playerTurn = document.querySelector('.display__turn');

    // Show error message
    const error = gameController.getError();
    // console.log(error);
    errorMsg.textContent = error;

    // Show winning message
    const winner = gameController.getWinner();
    // console.log(winner);

    if (winner) {
      winnerMsg.textContent = winner;
      disableBoard()
    }
  }

  function disableBoard() {
    // Clear active player's name
    const playerTurn = document.querySelector('.display__turn');
    playerTurn.textContent = '';

    // Disable inputs
    const form = document.querySelector('#form');
    // console.log(form.elements);
    Array.from(form.elements).forEach(element => element.disabled = true)

    // Disable Submit button
    const submitBtn = document.querySelector('#submit-btn');
    submitBtn.disabled = true

    // Disable Start button
    // const startBtn = document.querySelector('#start-btn');
    // startBtn.disabled = true

    // Disable all the buttons in board
    const boardContainer = document.querySelector('.display__board');
    const squares = boardContainer.querySelectorAll('.cell')
    // console.log(squares);
    Array.from(squares).forEach(btn => btn.disabled = true)
  }

  // disableBoard()


  function getPlayerNames() {
    // Get inputs
    let player1Input = document.querySelector('.player1');
    let player2Input = document.querySelector('.player2');
    // console.log(player1Input, player2Input);

    // Get name elements to show names
    const player1Name = document.querySelector('.players__one');
    const player2Name = document.querySelector('.players__two');

    player1Name.textContent = player1Input.value;
    gameController.players[0].name = player1Input.value;
    // console.log(gameController.players[0].name);

    player2Name.textContent = player2Input.value;
    gameController.players[1].name = player2Input.value;

    player1Input.value = '';
    player2Input.value = '';

    updateScreen();
  }
  // Add event listener for Submit button
  document.querySelector('#form').addEventListener('click', (event) => {
    event.preventDefault();
    getPlayerNames();
  });

  document.querySelector('#form').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      getPlayerNames();
      player1Input = '';
      player2Input = '';
    }
  });

  function restartGame() {
    // Get board data and set values to 0
    const board = gameBoard.getBoard();
    board.map((row) => row.map((cell) => cell.setValue()));
    

    // Get error & winner message divs and clear the text
    const winnerMsg = document.querySelector('.display__winner');
    // const errorMsg = document.querySelector('.display__error');

    winnerMsg.textContent = '';
    // errorMsg.textContent = '';
    gameController.clearWinner()

    // Change winMessage value
    let winMsg = gameController.getWinner()
    console.log(winMsg);
    winMsg = ''

    // Get name divs and clear them
    const player1Name = document.querySelector('.players__one');
    const player2Name = document.querySelector('.players__two');

    player1Name.textContent = '';
    player2Name.textContent = '';

    // Reset players names
    // gameController.players[0].name = 'Player 1';
    // gameController.players[1].name = 'Player 2';

    // Display player's turn
    // const activePlayer = gameController.getActivePlayer();
    // playerTurn.textContent = `${activePlayer.name}'s turn...`;

    // Enable inputs
    const form = document.querySelector('#form');
    // console.log(form.elements);
    Array.from(form.elements).forEach((element) => (element.disabled = false));

    // Clear player turn text
    // playerTurn.textContent = ''

    // Enable Submit button
    const submitBtn = document.querySelector('#submit-btn');
    submitBtn.disabled = false;
    
    updateScreen()
  }

  document.querySelector('#restart-btn').addEventListener('click', restartGame);

  // document.querySelector('#start-btn').addEventListener('click', restartGame)
  // Initial render
  updateScreen();
}

screenController();

