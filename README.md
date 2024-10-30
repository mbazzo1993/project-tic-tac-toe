# project-tic-tac-toe

## To Do

1. [X] Set up your project with HTML, CSS and Javascript files and get the Git repo all set up.
2. [ ] Architect the game and create the code template
  1. [X] Determine which objects / modules / factories are needed.
  2. [X] Determine all the functionality needed to make the game work and determine which objects / modules / factories they belong to.
  3. [ ] Create code template + pseudo code.
3. [ ] Implement all code to have a working game in the console.
4. [ ] Create an object to display / handle the DOM logic and write a function to render contents of the gameboard array to the page.
5. [ ] Write functions that allow players to add marks to specific spots on the board by interacting with the appropriate DOM elements. Implement logic to keep players from placing in spots already taken.
6. [ ] Implement an interface to let players put in their names, include a button to start / reset the game and add a display element to show results at end of the game.

## Plan

__Object: Gameboard__
  - Will store an array representing the game board. Simple 2D array where the first dimension represents the row and the second dimension represents the column.
  
    ```
    [
        [row 1 col 1, row 1 col 2, row 1 col 3],
        [row 2 col 1, row 2 col 2, row 2 col 3],
        [row 3 col 1, row 3 col 2, row 3 col 3]
    ]
    ```
  
  - Array property should be private.
  - Need method to place an 'X' or 'O' within a given index. Function signature should be:

    ```js
    function placeXorO(symbol, row, col)
    ```
  
      - The function should place the X or O only if the cell isn't currently occupied
      - The function should also check if the just-placed symbol resulted in a winner (i.e., should call another function)
  - There should also be a ```clearBoard()``` function.
  - There should be some function to check if there's a winner currently, based on the elements currently on the gameboard.
  - There should also probably be some private variable to track the number of turns taken in the game (as this will help with checking for win).
      - Alternatively, the function could return the number of empty spaces.

__Object: Player__
  - Needs to initialize a player
  - Key attributes:
      - Name
      - Symbol
  - Include getters and setters for name and symbol

__Object: Game__
  - Initialize the players 
  - Initialize the gameboard
  - Should control the flow of the game:
      - Randomly determine whch player goes first (this is X)
      - Asks player to take turn. Turn structure:
          - Player places symbol
          - Placement only registers if space is empty
          - If winner, end game and record winner
          - If no winner and board has empty space, go to next player
          - If no winner and board is full, end game as tie
  - Array to keep track of iterations of the game
  - A restart function to start a new game