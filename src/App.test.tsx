import { createInitialBoard, generateStartEndPoints, resetGameLogic, newGameLogic, viewGameLogic } from './components/GameSetup';
import { gameOverConditions, handleArrowKey, updateStats } from './components/GameLogic';

/**
 * Test that the game is set up correctly
 */
describe('Set up of game', () => {
  test('generateStartEndPoints returns valid points', () => {
    const { start, end } = generateStartEndPoints();
    expect(start).toBeGreaterThanOrEqual(0);
    expect(start).toBeLessThan(50);
    expect(end).toBeGreaterThanOrEqual(0);
    expect(end).toBeLessThan(50);
  });

  test('createInitialBoard generates with start and endpioints', () => {
    const board = createInitialBoard(0, 49);
    expect(board.length).toEqual(50); // 50 columns
    expect(board[0].length).toEqual(50); // 50 rows
    expect(board[0][0].type).toEqual('start');
    expect(board[49][49].type).toEqual('end');
  });

  test('resetGameLogic works', () => {
    const board = createInitialBoard(0, 49);
    const reset = resetGameLogic(board,0);
    expect(reset.board).toEqual(board);
    expect(reset.gameOver).toEqual(false);
    expect(reset.gameWon).toEqual(false);
    expect(reset.viewMode).toEqual(false);
    expect(reset.health).toEqual(200);
    expect(reset.moves).toEqual(450);
    expect(reset.playerPosition).toEqual({ x: 0, y: 0 });
    
  });

  test('newGameLogic works', () => {
    const board = createInitialBoard(0, 49);
    const reset = newGameLogic();
    expect(reset.board).not.toEqual(board);
    expect(reset.gameOver).toEqual(false);
    expect(reset.gameWon).toEqual(false);
    expect(reset.viewMode).toEqual(false);
    expect(reset.health).toEqual(200);
    expect(reset.moves).toEqual(450);
    expect(reset.playerPosition).toEqual({ x: reset.saveStart, y: 0 });
  });

  test('viewGameLogic works', () => {
    const viewMode = viewGameLogic();
    expect(viewMode).toEqual({"viewMode": false});
  });
})


/* 
*  Checking arrow key movements work
*  Checking health and moves decrease correctly based on type
*  Game over conditions
*/
describe('Game Play', () => {
  test('arrow key input changes x/y coordinates correctly', () => {
    const { x, y } = { x:5, y:5};
    expect(handleArrowKey('ArrowUp',x, y).x).toEqual(4);
    expect(handleArrowKey('ArrowRight',x, y).y).toEqual(6);
    expect(handleArrowKey('ArrowDown',x, y).x).toEqual(6);
    expect(handleArrowKey('ArrowLeft',x, y).y).toEqual(4);
  });

  test('health and moves change correclty based on type', () => {
    const {health, moves} = {health: 50, moves: 50};
    expect(updateStats('blank',health, moves).moves).toEqual(49);
    expect(updateStats('speeder',health, moves).health).toEqual(45);
    expect(updateStats('lava',health, moves).health).toEqual(0);
    expect(updateStats('lava',health, moves).moves).toEqual(40);
    expect(updateStats('mud',health, moves).health).toEqual(40);
    expect(updateStats('mud',health, moves).moves).toEqual(45);
    expect(updateStats('visited',health, moves).moves).toEqual(49);
  });

  test('game over conditions work', () => {
    let {health, moves} = {health: 50, moves: 50};
    expect(gameOverConditions('end', health, moves).gameWon).toEqual(true);

    health = -45;
    expect(gameOverConditions('lava', health, moves).gameOver).toEqual(true);

    health = 50;
    moves = 0;
    expect(gameOverConditions('lava', health, moves).gameOver).toEqual(true);

  });
});

