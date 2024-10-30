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
        logBoard();
    }

    function getEmptySpaces() {
        return emptySpaces;
    }

    return {placeXorO , getCellValue, getEmptySpaces, logBoard, clearBoard};

}