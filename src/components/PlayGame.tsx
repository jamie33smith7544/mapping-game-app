import { useEffect, useState } from 'react';
import './PlayGame.css';
import Stats from './Stats';
import { createInitialBoard, generateStartEndPoints, resetGameLogic, newGameLogic, viewGameLogic } from './GameSetup';

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

    /* Reset, New Game, View Game function cals */
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
        let {start,end} = generateStartEndPoints();
        let newBoard = createInitialBoard(start,end);
        setBoard(newBoard);
        setInitialBoard(newBoard);
        setSaveStart(start);
        setPlayerPosition({x: start, y:0})
        setHealth(200);
        setMoves(450);
        setGameOver(false);
        setGameWon(false);
        setViewMode(false);
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

        /* arrow key logic to move on board */
        switch (e.key) {
            case 'ArrowUp':
                newX = x >= 0 ? x - 1 : x;
                break;
            case 'ArrowRight':
                newY = y < 50 ? y + 1 : y;
                break;
            case 'ArrowDown':
                newX = x < 50 ? x + 1 : x;
                break;
            case 'ArrowLeft':
                newY = y >= 0 ? y - 1 : y;
                break;
            
            default:
                break;
        }
    
        /* update board with arrow key input */
        const newBoard = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (rowIndex === y && colIndex === x) {
                    if(cell.type !== 'start'){
                        return { type:'visited', visited: true };
                    }
                }
                return cell;
            })
        );

        /* update health and moves */
        let spaceType = board[newY][newX].type;
        switch (spaceType){
            case 'blank':
                newHealth = health;
                newMoves = moves - 1;
                break;
            case 'speeder':
                newHealth = health - 5;
                newMoves = moves;
                break;
            case 'lava':
                newHealth = health - 50;
                newMoves = moves - 10;
                break;
            case 'mud':
                newHealth = health - 10;
                newMoves = moves - 5;
                break;
            case 'end':
                setGameWon(true); // Game won condition
                setViewMode(true);
                break;
            default:
                newHealth = health;
                newMoves = moves;
        }

        /* update game variables */
        setBoard(newBoard);
        setPlayerPosition({ x: newX, y: newY });
        setHealth(newHealth);
        setMoves(newMoves);

        /* Check for game lost conditions */
        if (newHealth <= 0 || newMoves <= 0) {
            if (newHealth <=0){
                setHealth(0);
            }
            else {
                setMoves(0);
            }
            setGameOver(true);
            setViewMode(true);
        }
    };

    /* listener for user input on keyboard */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [board, initialBoard, saveStart, playerPosition,health, moves, gameWon, gameOver, viewMode]);

    /* return board in div format */
    return (
        <div id="game">
            <div id="game-status">
                <div id="stats">
                    <Stats health={health} moves={moves} />
                </div>
                <button onClick={newGame}>New Game</button>
                <button onClick={resetGame}>Reset</button>
            </div>
            <div id="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex}>
                        {row.map((cell, colIndex) => {
                            let className = 'space ' + cell.type + '-space';
                            if (rowIndex === playerPosition.y && colIndex === playerPosition.x && cell.type !== 'start') {
                                className = 'space player-space';
                            } else if (cell.visited) {
                                className = 'space visited-space';
                            }
                            return <div key={colIndex} className={className}></div>;
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
                        <button className="close-button" onClick={viewGame}>View Game</button>
                        <button onClick={newGame}>New Game</button>
                        <button onClick={resetGame}>Reset</button>
                    </div>
                </div>
            )}
            {gameWon && !gameOver && viewMode && (
                <div className="overlay">
                    <div className="message-box">
                        <h1>Congratulations!</h1>
                        <p>You Won!</p>
                        <button className="close-button" onClick={viewGame}>View Game</button>
                        <button onClick={newGame}>New Game</button>
                        <button onClick={resetGame}>Reset</button>
                    </div>
                </div>
            )}
        </div>
        
    );
}