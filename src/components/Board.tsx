import { useEffect, useState } from 'react';
import './Board.css';
import Stats from './Stats';

const createInitialBoard = (start: number, end: number) => {
    const board = [];

    /*Make the board. j is the row, i is the column.  Use (j,i) for (x,y) coordinates and (0,0) is top left corner*/
    for (let j = 0; j < 50; j++) { //x axis
        const row = [];
        for (let i = 0; i < 50; i++) { //y axis
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
}

export default function CreateBoard() {
    /* Generate random start and end points*/
    const generateStartEndPoints = () => {
        let start = Math.floor(Math.random() * 50);
        let end = Math.floor(Math.random() * 50);
        return {start,end}
    }
    
    const {start,end} = generateStartEndPoints();

    /* set new board, player position, health, moves */
    const [board, setBoard] = useState(createInitialBoard(start, end));
    const [initialBoard, setInitialBoard] = useState(board); //copy of initial board for reset
    const [saveStart, setSaveStart] = useState(start); //copy of start position for reset
    const [playerPosition, setPlayerPosition] = useState({ x: start, y: 0 });
    const [health, setHealth] = useState(200);
    const [moves, setMoves] = useState(450);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    /* Reset, New Game, View Game options */
    const resetGame = () => {
        setBoard(initialBoard)
        setPlayerPosition({ x: saveStart, y: 0 });
        setHealth(2000);
        setMoves(450);
        setGameOver(false);
        setGameWon(false);
        setViewMode(false);
    }

    /* generate a new game entirely */
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

    /* player can view game upon gameOver or gameWon */
    const viewGame = () => {
        setViewMode(false);
    };


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
        if (newX !== y || newY !== x) {
            const newBoard = board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (rowIndex === y && colIndex === x) {
                        
                        return { type:'visited', visited: true };
                    }
                    return cell;
                })
            );
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

            setBoard(newBoard);
            setPlayerPosition({ x: newX, y: newY });
            setHealth(newHealth);
            setMoves(newMoves);

            // Check for game LOST conditions
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
        }
    };

    /* lisntener for user input on keyboard */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerPosition, board, health, moves, gameWon, gameOver]);

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
                            if (rowIndex === playerPosition.y && colIndex === playerPosition.x) {
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
