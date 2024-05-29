import { useEffect, useState } from 'react';
import './PlayGame.css';
import { createInitialBoard, generateStartEndPoints, resetGameLogic, newGameLogic, viewGameLogic } from './GameSetup';
import { gameOverConditions, handleArrowKey, updateStats } from './GameLogic';

/**
 * Handles the Logic of the whole game
 * @returns html to return of the game being played
 */
export default function CreateBoard() {
    /* set new board, player position, health, moves */
    const {start,end} = generateStartEndPoints();
    const [board, setBoard] = useState(createInitialBoard(start, end));
    const [initialBoard, setInitialBoard] = useState(board); //copy of initial board for reset
    const [saveStart, setSaveStart] = useState(start); //copy of start position for reset
    const [playerPosition, setPlayerPosition] = useState({ x: start, y: 0 });
    const [health, setHealth] = useState(200);
    const [moves, setMoves] = useState(450);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    /* Reset, New Game, View Game function calls */
    const resetGame = () => {
        const reset = resetGameLogic(initialBoard, saveStart);
        setBoard(reset.board)
        setPlayerPosition(reset.playerPosition);
        setHealth(reset.health);
        setMoves(reset.moves);
        setGameOver(reset.gameOver);
        setGameWon(reset.gameWon);
        setViewMode(reset.viewMode);
    }

    const newGame = () => {
        const newGame = newGameLogic();
        setBoard(newGame.board);
        setInitialBoard(newGame.board);
        setSaveStart(newGame.saveStart);
        setPlayerPosition(newGame.playerPosition);
        setHealth(newGame.health);
        setMoves(newGame.moves);
        setGameOver(newGame.gameOver);
        setGameWon(newGame.gameWon);
        setViewMode(newGame.viewMode);
    }

    const viewGame = () => {
        setViewMode(viewGameLogic().viewMode);
    };

    /* Handle user input from keyboard */
    const handleKeyDown = (e: { key: any; }) => {
        if (gameOver || gameWon) return;

        const { x, y } = playerPosition;
        let newX = x;
        let newY = y;
        let newHealth = health;
        let newMoves = moves;

        /* call function to handle key input */
        let result = handleArrowKey(e.key, x ,y);
        newX = result.x;
        newY = result.y;

    
        /* update board with arrow key input */
        const newBoard = board.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
                if (rowIdx === y && colIdx === x) {
                    if(cell.type !== 'start'){
                        return { type:'visited', visited: true };
                    }
                }
                return cell;
            })
        );

        /* update health and moves */
        let spaceType = board[newY][newX].type;
        let updated = updateStats(spaceType, health, moves);
        newHealth = updated.health;
        newMoves = updated.moves;

        /* update game variables */
        setBoard(newBoard);
        setPlayerPosition({ x: newX, y: newY });
        

        /* Game over conditions */
        let results = gameOverConditions(spaceType, newHealth, newMoves)
        setHealth(results.health);
        setMoves(results.moves);
        setGameOver(results.gameOver);
        setGameWon(results.gameWon);
        setViewMode(results.viewMode);
    };

    /* listener for user input on keyboard */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [board, initialBoard, saveStart, playerPosition,health, moves, gameWon, gameOver, viewMode]);

    /* return board, stats in div format */
    return (
        <div id="game">
            <div id="board">
                {board.map((row, rowIdx) => (
                    <div key={rowIdx}>
                        {row.map((cell, colIdx) => {
                            let className = 'space ' + cell.type + '-space';
                            if (rowIdx === playerPosition.y && colIdx === playerPosition.x && cell.type !== 'start') {
                                className = 'space player-space';
                            } else if (cell.visited) {
                                className = 'space visited-space';
                            }
                            return <div key={colIdx} className={className}></div>;
                        })}
                    </div>
                ))}
            </div>
            
            {/* Popups for when player wins or loses game */}
            {((health <= 0 || moves <= 0) && viewMode) && (
                <div className="overlay">
                    <div className="message-box">
                        <h1>Game Over</h1>
                        {health <= 0 ? <p>You ran out of health!</p> : <p>You ran out of moves!</p>}
                        <button className="game-button" onClick={viewGame}>View Game</button>
                        <button className="game-button" onClick={newGame}>New Game</button>
                        <button className="game-button" onClick={resetGame}>Reset</button>
                    </div>
                </div>
            )}
            {gameWon && !gameOver && viewMode && (
                <div className="overlay">
                    <div className="message-box">
                        <h1>Congratulations!</h1>
                        <p>You Won!</p>
                        <button className="game-button" onClick={viewGame}>View Game</button>
                        <button className="game-button" onClick={newGame}>New Game</button>
                        <button className="game-button" onClick={resetGame}>Reset</button>
                    </div>
                </div>
            )}
            <div id="game-status">
                <div id="stats">
                    <h1>Health: {health}</h1>
                    <h1>Moves: {moves}</h1>
                </div>
                <button className="game-button" onClick={newGame}>New Game</button>
                <button className="game-button" onClick={resetGame}>Reset</button>
            </div>
        </div>
        
    );
}