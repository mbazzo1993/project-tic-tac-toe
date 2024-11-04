(function gameControl() {
  // Instantiate game object
  const newGame = game("Player 1", "Player 2");

  // Instantiate page element objects
  const elemScreen = document.querySelector("div.screen");
  const elemStartBtn = document.querySelector("div.menu-wrapper button.start");
  const [elemCancelBtn] = document.querySelectorAll("div.btn-menu button");
  const elemForm = document.querySelector("form");
  const elemDialog = document.querySelector("dialog");
  const elemBoard = document.querySelector(".board");

  // Register event handlers
  const showModal = elemStartBtn.addEventListener("click", () => {
    if (elemStartBtn.innerText === "Start Game") {
      elemDialog.showModal();
      return;
    }

    if (elemStartBtn.innerText === "New Game") {
      resetGame();
      elemStartBtn.disable = true;
      return;
    }
  });
  const handleCancel = elemCancelBtn.addEventListener("click", () => {
    elemDialog.close();
  });
  const handleSave = elemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    elemDialog.close();
    elemStartBtn.innerText = "New Game";
    elemStartBtn.disabled = true;

    const data = new FormData(event.target);
    const dataObject = Object.fromEntries(data.entries());

    newGame.setPlayer1Name(dataObject.p1Name);
    newGame.setPlayer2Name(dataObject.p2Name);
    newGame.setIsGameOn(true);

    getPlayerInput();
  });
  const handleSelectCell = elemBoard.addEventListener("click", (event) => {
    let elemCell;

    if (!newGame.getIsGameOn()) {
      return;
    }

    if (event.target.tagName === "DIV") {
      elemCell = event.target;
    }

    if (event.target.tagName === "SPAN") {
      elemCell = event.target.parentNode;
    }

    const row = parseInt(elemCell.dataset.row);
    const col = parseInt(elemCell.dataset.col);
    const placeXorORes = newGame.placeXorO(row, col);
    console.log(placeXorORes);
    const selectCellVal =
      placeXorORes === -2 ? "" : newGame.getCurrentPlayerSymbol();

    if (placeXorORes === -2) {
      // space is occupied
      registerSpaceOccupiedMsg();
      return;
    }

    if (placeXorORes !== -2) {
      elemCell.children[0].innerText = selectCellVal;
    }

    if (placeXorORes === 0) {
      // no winner, next player
      newGame.changePlayer();
      getPlayerInput();
      return;
    }

    if (placeXorORes === -1) {
      // game ends in a draw
      newGame.appendDrawResult();
      registerGameDrawMsg();
      newGame.setIsGameOn(false);
      elemStartBtn.disabled = false;
      return;
    }

    if (placeXorORes === 1) {
      // we have a winner
      newGame.appendWinResult();
      registerGameWonMsg();
      newGame.setIsGameOn(false);
      elemStartBtn.disabled = false;
      return;
    }
  });

  function getPlayerInput() {
    updateScreen(
      `${newGame.getCurrentPlayerName()}, please click on an empty cell to place an "${newGame.getCurrentPlayerSymbol()}".`
    );
  }

  function updateScreen(screenText) {
    elemScreen.children[0].innerText = screenText;
  }

  function registerSpaceOccupiedMsg() {
    updateScreen(
      `The cell you selected is occupied. ${newGame.getCurrentPlayerName()}, please click on an empty cell to place an "${newGame.getCurrentPlayerSymbol()}".`
    );
  }

  function registerGameWonMsg() {
    let msg;
    msg = `${newGame.getCurrentPlayerName()} has WON the game!!!!

        Here is a summary of the results so far...

        ${newGame.getResultsSummary()}
        
        Click the "New Game" button to start a new game.`;
    updateScreen(msg);
  }

  function registerGameDrawMsg() {
    let msg;
    msg = `The game ends in a DRAW!!!!

        Here is a summary of the results so far...

        ${newGame.getResultsSummary()}
        
        Click the "New Game" button to start a new game.`;
    updateScreen(msg);
  }

  function resetGame() {
    for (cell of elemBoard.children) {
      cell.children[0].innerText = "";
    }
    newGame.resetGame();
    newGame.setIsGameOn(true);
    elemStartBtn.disabled = true;
    getPlayerInput();
  }

  // FACTORIES

  // Game factory
  function game(player1Name, player2Name) {
    let results = [];
    const gameBoardObj = gameBoard();
    const player1 = player(player1Name, "X");
    const player2 = player(player2Name, "O");
    let playerArray = [player1, player2];
    let currPlayerInd = 0; // 'X' will start the game
    let isGameOn = false;

    function getCurrentPlayerName() {
      return playerArray[currPlayerInd].getName();
    }

    function setPlayer1Name(name) {
      player1.setName(name);
    }

    function setPlayer2Name(name) {
      player2.setName(name);
    }

    function getCurrentPlayerSymbol() {
      return playerArray[currPlayerInd].getSymbol();
    }

    function getIsGameOn() {
      return isGameOn;
    }

    function setIsGameOn(setting) {
      isGameOn = setting;
    }

    function placeXorO(row, col) {
      return gameBoardObj.placeXorO(
        playerArray[currPlayerInd].getSymbol(),
        row,
        col
      );
    }

    function changePlayer() {
      currPlayerInd = (currPlayerInd + 1) % 2; // change player
    }

    function appendWinResult() {
      const result = {
        player1: player1,
        player2: player2,
        gameBoard: gameBoardObj,
        winner: playerArray[currPlayerInd],
        res: "WIN",
      };
      results.push(result);
    }

    function appendDrawResult() {
      const result = {
        player1: player1,
        player2: player2,
        gameBoard: gameBoardObj,
        winner: undefined,
        res: "DRAW",
      };
      results.push(result);
    }

    function getResultsSummary() {
      if (results.length === 0) {
        return;
      }

      const p1Name = player1.getName();
      const p2Name = player2.getName();

      let scoresObj = {};
      scoresObj[p1Name] = 0;
      scoresObj[p2Name] = 0;
      scoresObj.draws = 0;

      for (result of results) {
        if (result.res === "WIN") {
          scoresObj[result.winner.getName()] += 1;
        }

        if (result.res === "DRAW") {
          scoresObj.draws += 1;
        }
      }

      return `${p1Name}: ${scoresObj[p1Name]} | DRAWS: ${scoresObj["draws"]} | ${p2Name}: ${scoresObj[p2Name]}`;
    }

    function resetGame() {
      gameBoardObj.clearBoard();
      currPlayerInd = 0;
      // reassign players
      if (playerArray[0].getName() === player1.getName()) {
        playerArray[0] = player2;
        player2.setSymbol("X");
        playerArray[1] = player1;
        player1.setSymbol("O");
      } else {
        playerArray[0] = player1;
        player1.setSymbol("X");
        playerArray[1] = player2;
        player2.setSymbol("O");
      }
    }

    return {
      getCurrentPlayerName,
      getCurrentPlayerSymbol,
      setPlayer1Name,
      setPlayer2Name,
      getIsGameOn,
      placeXorO,
      changePlayer,
      appendWinResult,
      appendDrawResult,
      getResultsSummary,
      setIsGameOn,
      resetGame,
    };
  }

  // Gameboard factory
  function gameBoard() {
    const board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    const winCombos = {
      row1: [
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      row2: [
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      row3: [
        [3, 1],
        [3, 2],
        [3, 3],
      ],
      col1: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      col2: [
        [1, 2],
        [2, 2],
        [3, 2],
      ],
      col3: [
        [1, 3],
        [2, 3],
        [3, 3],
      ],
      diag1: [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      diag2: [
        [3, 1],
        [2, 2],
        [1, 3],
      ],
    };

    let emptySpaces = 9;

    function placeXorO(symbol, row, col) {
      if (board[row - 1][col - 1] === "") {
        board[row - 1][col - 1] = symbol;
        emptySpaces--;
        return checkTurnResult(symbol, row, col);
      } else {
        return -2; // if space is occupied
      }
    }

    function checkTurnResult(symbol, row, col) {
      if (emptySpaces <= 6 && checkWinCombos(symbol, row, col)) {
        return 1; // If winner, return 1.
      } else if (emptySpaces === 0) {
        return -1; // If draw, return -1
      } else {
        return 0; // No winner, game continues
      }
    }

    function checkWinCombos(symbol, row, col) {
      let cell = [row, col];
      let isGameWon = false;
      for (winComboKey of Object.keys(winCombos)) {
        let cellInWinCombo = false;
        for (winComboCell of winCombos[winComboKey]) {
          cellInWinCombo =
            winComboCell[0] === cell[0] && winComboCell[1] === cell[1];
          if (cellInWinCombo) break;
        }
        if (cellInWinCombo) {
          let [cell1, cell2, cell3] = winCombos[winComboKey];
          isGameWon =
            getCellValue(cell1) === symbol &&
            getCellValue(cell2) === symbol &&
            getCellValue(cell3) === symbol;
        }
        if (isGameWon) break;
      }
      return isGameWon;
    }

    function getCellValue(cell) {
      return board[cell[0] - 1][cell[1] - 1];
    }

    function logBoardToConsole() {
      let output = "";
      for (row of board) {
        output += "\n";
        for (cell of row) {
          output += ` [${cell === "" ? " " : cell}] `;
        }
      }
      output += "\n";
      console.log(output);
    }

    function clearBoard() {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[i][j] = "";
        }
      }
      emptySpaces = 9;
    }

    function getEmptySpaces() {
      return emptySpaces;
    }

    return {
      placeXorO,
      getCellValue,
      getEmptySpaces,
      logBoardToConsole,
      clearBoard,
    };
  }

  // Player factory
  function player(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    function getName() {
      return playerName;
    }

    function setName(name) {
      playerName = name;
    }

    function getSymbol() {
      return playerSymbol;
    }

    function setSymbol(symbol) {
      playerSymbol = symbol;
    }

    return {
      getName,
      setName,
      getSymbol,
      setSymbol,
    };
  }

  return {
    showModal,
    handleCancel,
    handleSave,
    handleSelectCell,
  };
})();