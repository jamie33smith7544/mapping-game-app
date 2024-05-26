import { render, screen, fireEvent } from '@testing-library/react';
import CreateBoard from './components/PlayGame';
import { createInitialBoard, generateStartEndPoints, resetGameLogic, newGameLogic, viewGameLogic } from './components/GameSetup';

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


/* TODO:
*  Checking arrow key movements work
*  Checking health and moves decrease correctly based on type
*  Checking user loses or wins correctly
*/
