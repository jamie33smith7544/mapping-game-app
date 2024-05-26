/**
 * Creates the game board
 * @param start - Value of random start point
 * @param end - value of reandom end point
 * @returns - a 50 x 50 board with start, end and randomly assigned values
 */
export const createInitialBoard = (start: number, end: number) => {
    const board = [];

    /*Make the board. Use (j,i) for (x,y) coordinates and (0,0) is top left corner*/
    for (let j = 0; j < 50; j++) { // column and x axis
        const row = [];
        for (let i = 0; i < 50; i++) { //row and y axis
            let type = 'blank';

            // Set start and end
            if (i === start && j === 0){
                type = 'start';
            }
            else if (i === end && j === 49){
                type = 'end';
            }
            // set space values
            else{
                const number = Math.floor(Math.random() * 6); //random number for space assignment (33% for blank, 16% for the rest)
                type = ['blank', 'blank','blank','speeder', 'lava', 'mud'][number];            
            }
            row.push({type, visited: false});
        } 
        board.push(row);
    }
    return board; 
};

/**
 * Generates random start and end point values (just the row value, first and last column can be hard coded)
 * @returns random start and end point
 */
export const generateStartEndPoints = () => {
  let start = Math.floor(Math.random() * 50);
  let end = Math.floor(Math.random() * 50);
  return { start, end };
};
  
/**
 * Resets the board 
 * @param initialBoard - Saved board without any user input or created path 
 * @param saveStart - Saved starting point (gets changed with logic)
 * @returns - the same board from before with no user input
 */
export const resetGameLogic = (initialBoard: any[][], saveStart: number) => {
  return {
    board: initialBoard,
    playerPosition: { x: saveStart, y: 0 },
    health: 200,
    moves: 450,
    gameOver: false,
    gameWon: false,
    viewMode: false,
  };
};
 
/**
 * Generates a new board entirely
 * @returns - a newly gnerated board with new start, end, and space values
 */
export const newGameLogic = () => {
  const { start, end } = generateStartEndPoints();
  const newBoard = createInitialBoard(start, end);
  return {
    board: newBoard,
    initialBoard: newBoard,
    saveStart: start,
    playerPosition: { x: start, y: 0 },
    health: 200,
    moves: 450,
    gameOver: false,
    gameWon: false,
    viewMode: false,
  };
};

/**
 * Allows the user to view the game, without actually playing it still
 * @returns - view mode as true until game is reset or another is created
 */
export const viewGameLogic = () => {
    return {
        viewMode: false,
    }
};