function game(player1Name, player2Name) {
    let results = [];
    let winner = '';
    const gameBoardObj = gameBoard();
    const player1 = player(player1Name, 'X');
    const player2 = player(player2Name, 'O');
    let playerArray = [player1, player2];
    let currPlayerInd = 0; // 'X' will start the game

    function run() { // game loop
        gameBoardObj.logBoard();
        while (true) {
            console.log(`${playerArray[currPlayerInd].getName()}'s turn...`)
            let selection = getPlayerInput(playerArray[currPlayerInd]);
            let turnResult = gameBoardObj.placeXorO(playerArray[currPlayerInd].getSymbol(), selection[0], selection[1]);
            if (turnResult === -2) {
                console.log('This cell is occupied, please pick another...');
            } else if (turnResult === 0) {
                currPlayerInd = (currPlayerInd + 1) % 2; // change player
            } else if (turnResult === 1) {
                console.log(`${playerArray[currPlayerInd].getName()} has won the game!!!!`);
                const result = {
                    player1 : player1,
                    player2 : player2,
                    gameBoard : gameBoardObj,
                    winner : playerArray[currPlayerInd]
                }
                results.push(result);
                if (resetGame() === 0) {
                    break;
                }
            } else if (turnResult === -1) {
                console.log(`The game is a draw.`);
                const result = {
                    player1 : player1,
                    player2 : player2,
                    gameBoard : gameBoardObj,
                    winner : undefined
                }
                results.push(result);
                if (resetGame() === 0) {
                    break;
                }
            }

        }
    }

    function getPlayerInput(playerObj) {
        let dims = ['row','column']
        let row;
        let col;
        while(true) {
            row = prompt(`${playerObj.getName()}, please select the row number (1, 2, or 3) representing the cell for which you'd like to place an "${playerObj.getSymbol()}", then hit ENTER: `);
            if (parseInt(row) !== 1 && parseInt(row) !== 2 && parseInt(row) !== 3) {
                console.log(`${row} is not a valid row number. Please try again...`);
                continue;
            }
            col = prompt(`${playerObj.getName()}, please select the column number (1, 2, or 3) representing the cell for which you'd like to place an "${playerObj.getSymbol()}", then hit ENTER: `);
            if (parseInt(col) !== 1 && parseInt(col) !== 2 && parseInt(col) !== 3) {
                console.log(`${col} is not a valid row number. Please try again...`);
                continue;
            }
            break;
        }
        return [parseInt(row), parseInt(col)]
    }

    function resetGame() {
        while(true) {
            let ans = prompt(`Would you like to play again? (y/n) `);

            if (ans.toLowerCase() === 'n') {
                console.log('GAME OVER');
                return 0;
            }

            if (ans.toLowerCase() === 'y') {
                console.log('Resetting board...');
                gameBoardObj.clearBoard();
                currPlayerInd = 0;
                // reassign players
                if (playerArray[0].getName() === player1.getName()) {
                    playerArray[0] = player2;
                    player2.setSymbol('X');
                    playerArray[1] = player1;
                    player1.setSymbol('O');
                } else {
                    playerArray[0] = player1;
                    player1.setSymbol('X');
                    playerArray[1] = player2;
                    player2.setSymbol('O');
                }
                gameBoardObj.logBoard();
                return 1;
            }
        }
    }

    return {run};
}

function gameBoard() {
    const board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    const winCombos = {
        row1: [[1,1],[1,2],[1,3]],
        row2: [[2,1],[2,2],[2,3]],
        row3: [[3,1],[3,2],[3,3]],
        col1: [
            [1,1],
            [2,1],
            [3,1]
        ],
        col2: [
                [1,2],
                [2,2],
                [3,2]
        ],
        col3: [
                    [1,3],
                    [2,3],
                    [3,3]
        ],
        diag1: [
            [1,1],
                [2,2],
                    [3,3]
        ],
        diag2: [
                    [3,1],
                [2,2],
            [1,3]
        ]
    }

    let emptySpaces = 9;

    function placeXorO (symbol, row, col) {
        if (board[row-1][col-1] === '') {
            board[row-1][col-1] = symbol;
            emptySpaces--;
            return checkTurnResult(symbol, row, col);
        } else {
            return -2; // if space is occupied
        }
    }

    function checkTurnResult(symbol, row, col) {
        logBoard()
        if (emptySpaces <= 6 && checkWinCombos(symbol, row, col)) { 
            return 1; // If winner, return 1.
        } else if (emptySpaces === 0) {
            return -1; // If draw, return -1
        } else {
            return 0; // No winner, game continues
        }
    }

    function checkWinCombos(symbol, row, col) {
        let cell = [row,col];
        let isGameWon = false;
        for (winComboKey of Object.keys(winCombos)) {
            let cellInWinCombo = false
            for (winComboCell of winCombos[winComboKey]) {
                cellInWinCombo = (winComboCell[0] === cell[0]) && (winComboCell[1] === cell[1]);
                if (cellInWinCombo) break;
            }
            if (cellInWinCombo) {
                let [cell1, cell2, cell3] = winCombos[winComboKey];
                isGameWon = (getCellValue(cell1) === symbol) && 
                            (getCellValue(cell2) === symbol) &&
                            (getCellValue(cell3) === symbol);
            }
            if (isGameWon) break;
        }
        return isGameWon;
    }

    function getCellValue (cell) {
        return board[cell[0]-1][cell[1]-1];
    }

    function logBoard() {
        let output = '';
        for (row of board) {
            output += '\n';
            for (cell of row) {
                output += ` [${cell === '' ? ' ' : cell}] `;
            }
        }
        output += '\n';
        console.log(output);
    }

    function clearBoard() {
        for (i in board) {
            for (j in row) {
                board[i][j] = '';
            }
        }
        emptySpaces = 9;
    }

    function getEmptySpaces() {
        return emptySpaces;
    }

    return {placeXorO , getCellValue, getEmptySpaces, logBoard, clearBoard};

}

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

    return {getName, setName, getSymbol, setSymbol};
}

// just for testing
function play() {
    const newGame = game('Bob', 'Pat');
    newGame.run();
}