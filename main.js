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

  // Update square value with marker when a play has been made
  const markSquare = (row, column, marker) => {
    const square = board[row][column];
    if (square.getValue() === '') {
      square.addMarker(marker);
      return true;
    }
    return false;
  };

  // Print board to console
  const printBoard = () => {
    const squares = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(squares);
  };

  return { getBoard, printBoard, markSquare };
})();

function square() {
  let value = '';

  // Get value of square
  const getValue = () => value;

  // Add marker to square
  const addMarker = (marker) => {
    value = `<img class="cell__image" src="${marker}" alt="" width="80" height="80">`;
  };

  // Reset value to 0
  const setValue = () => (value = '');

  return { getValue, addMarker, setValue };
}

const checkValues = (function () {
  const board = gameBoard.getBoard();

  // Check the squares in each row for same values
  const checkRows = () =>
    board.some((row) => {
      const rowValues = row.map((cell) => cell.getValue());
      return rowValues.every((value) => value !== '' && value === rowValues[0]);
    });

  // Loop through every column and check the values are same
  const checkColumns = () => {
    for (let columnIndex = 0; columnIndex < board.length; columnIndex++) {
      const columnValues = board.map((row) => row[columnIndex].getValue());
      const allSame = columnValues.every(
        (value) => value !== '' && value === columnValues[0]
      );

      if (allSame) {
        return true;
      }
    }
  };

  // Check the squares diagonally for same values
  const checkDiagonals = () => {
    const leftToRightDiagonal = [];
    const rightToLeftDiagonal = [];

    for (let i = 0; i < board.length; i++) {
      leftToRightDiagonal.push(board[i][i].getValue());
      rightToLeftDiagonal.push(board[i][board.length - 1 - i].getValue());
    }

    const isLeftToRightDiagonalSame = leftToRightDiagonal.every(
      (value) => value !== '' && value === leftToRightDiagonal[0]
    );
    const isRightToLeftDiagonalSame = rightToLeftDiagonal.every(
      (value) => value !== '' && value === rightToLeftDiagonal[0]
    );

    if (isLeftToRightDiagonalSame || isRightToLeftDiagonalSame) {
      return true;
    }
  };

  const checkEmptySquares = () => {
    const board = gameBoard.getBoard();
    return board.some((row) => row.some((cell) => cell.getValue() === ''));
  };

  const hasEmptySquares = () => checkEmptySquares();

  return { checkRows, checkColumns, checkDiagonals, hasEmptySquares };
})();

const gameController = (function (
  player1Name = 'player 1',
  player2Name = 'player 2'
) {
  // Create players
  let players = [
    {
      name: player1Name,
      marker: './images/icon-circle.png',
    },
    {
      name: player2Name,
      marker: './images/icon-cross.png',
    },
  ];

  const resetPlayerNames = () => {
    players[0].name = 'player 1';
    players[1].name = 'player 2';
  };

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  // Reset active player
  const resetActivePlayer = () => {
    activePlayer = players[0];
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  let errorMessage = '';

  const updateMarker = (row, column) => {
    const success = gameBoard.markSquare(row, column, getActivePlayer().marker);
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
      errorMessage = `Square is already occupied. Please choose a different one.`;
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  const getErrorMsg = () => errorMessage;

  const printNewRound = () => {
    gameBoard.printBoard();
  };

  const playRound = (row, column) => {
    console.log(
      `${
        getActivePlayer().name
      } marking the square in row: ${row} column: ${column}`
    );

    updateMarker(row, column);
  };

  let winMessage = '';
  let drawMessage = '';
  const checkForWinner = () => {
    const isWinner =
      checkValues.checkRows() ||
      checkValues.checkColumns() ||
      checkValues.checkDiagonals();

    if (isWinner) {
      console.log(`${getActivePlayer().name} has won`);
      winMessage = `${getActivePlayer().name} has won`;
    } else if (!isWinner && !checkValues.hasEmptySquares()) {
      console.log(`The game is a draw`);
      drawMessage = `The game is a draw`;
    } else {
      switchPlayerTurn();
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  const getWinMsg = () => winMessage;
  const getDrawMsg = () => drawMessage;

  const clearWinMsg = () => {
    winMessage = '';
  };
  const clearDrawMsg = () => {
    drawMessage = '';
  };

  // Initial render
  printNewRound();
  console.log(`${getActivePlayer().name}'s turn.`);

  return {
    players,
    playRound,
    getDrawMsg,
    getWinMsg,
    clearDrawMsg,
    clearWinMsg,
    getErrorMsg,
    getActivePlayer,
    resetActivePlayer,
    resetPlayerNames,
    getBoard: gameBoard.getBoard,
  };
})();

function screenController() {
  // Get html elements
  const boardContainer = document.querySelector('.display__board');
  const playerTurn = document.querySelector('.display__turn');
  const board = gameController.getBoard();
  const form = document.querySelector('#form');
  const drawMsgElement = document.querySelector('.display__draw');
  const winnerMsgElement = document.querySelector('.display__winner');
  const player1Element = document.querySelector('.players__one');
  const player2Element = document.querySelector('.players__two');

  function updatePlayerNames() {
    // Get inputs
    let player1Input = document.querySelector('.player1');
    let player2Input = document.querySelector('.player2');

    player1Element.textContent = player1Input.value;
    gameController.players[0].name = player1Input.value;

    player2Element.textContent = player2Input.value;
    gameController.players[1].name = player2Input.value;

    player1Input.value = '';
    player2Input.value = '';

    updateScreen();
  }

  const showDefaultNames = () => {
    const player1Img = `<img src="${gameController.players[0].marker}" alt="Player 1 marker" width="30" height="30">`;
    const player2Img = `<img src="${gameController.players[1].marker}" alt="Player 2 marker" width="30" height="30">`;

    player1Element.innerHTML = `${player1Img} ${gameController.players[0].name}`;
    player2Element.innerHTML = `${player2Img} ${gameController.players[1].name}`;
  };

  const formatActivePlayerName = () => {
    const activePlayer = gameController.getActivePlayer();
    const name = activePlayer.name;

    // Format player's name for display
    const formattedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;

    // Display player's turn
    playerTurn.textContent = `${formattedName}'s turn...`;
  };

  const updateScreen = () => {
    showDefaultNames();
    formatActivePlayerName();

    // Clear the board after each turn
    boardContainer.textContent = '';

    // const board = gameController.getBoard();

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
    const target = event.target;
    const isImg = target.nodeName === 'IMG';
    const button = isImg ? target.parentNode : target;
    const row = button.dataset.row;
    const col = button.dataset.column;

    if (!row || !col) return;

    gameController.playRound(row, col);
    updateScreen();
    showErrorMsg();
    showDrawMsg();
    showWinMsg();
  }

  const showErrorMsg = () => {
    const errorElement = document.querySelector('.display__error');

    // Display error message
    const errorMsg = gameController.getErrorMsg();
    errorElement.textContent = errorMsg;
  };

  const showDrawMsg = () => {
    // Display draw message
    const drawMsg = gameController.getDrawMsg();
    if (drawMsg) {
      drawMsgElement.textContent = drawMsg;

      disableBoard();
    }
  };

  const showWinMsg = () => {
    // Display winner message
    const winMsg = gameController.getWinMsg();
    if (winMsg) {
      winnerMsgElement.textContent = winMsg;

      disableBoard();
    }
  };

  function disableBoard() {
    // Clear active player's name
    playerTurn.textContent = '';

    // Disable inputs
    Array.from(form.elements).forEach((element) => (element.disabled = true));

    // Disable Submit button
    const submitBtn = document.querySelector('#submit-btn');
    submitBtn.disabled = true;

    // Disable all the buttons in board
    const squares = boardContainer.querySelectorAll('.cell');
    Array.from(squares).forEach((btn) => (btn.disabled = true));
  }

  function resetGame() {
    resetBoard();
    clearMessages();
    resetNames();

    // Reset active player
    gameController.resetActivePlayer();

    // Reset player names
    gameController.resetPlayerNames();

    // Enable inputs
    Array.from(form.elements).forEach((element) => (element.disabled = false));

    updateScreen();
  }

  const resetBoard = () => {
    // Reset the values of the board
    board.forEach((row) => row.forEach((cell) => cell.setValue('')));
  };

  const clearMessages = () => {
    // Clear text content of winner and draw message divs

    winnerMsgElement.textContent = '';
    drawMsgElement.textContent = '';

    // Reset draw and win message values
    gameController.clearDrawMsg();
    gameController.clearWinMsg();
  };

  const resetNames = () => {
    // Get name divs and clear them

    player1Element.textContent = '';
    player2Element.textContent = '';
  };

  // Add event listener for Submit button
  document.querySelector('#form').addEventListener('submit', (event) => {
    event.preventDefault();
    updatePlayerNames();
  });

  document.querySelector('#form').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updatePlayerNames();
    }
  });

  boardContainer.addEventListener('click', handleBtnClick);

  document.querySelector('#restart-btn').addEventListener('click', resetGame);

  // Initial render
  updateScreen();
}

screenController();
