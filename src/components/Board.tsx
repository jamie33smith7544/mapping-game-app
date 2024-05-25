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
                const number = Math.floor(Math.random() * 4); //random number for space assignment
                type = ['blank', 'speeder', 'lava', 'mud'][number];            
            }
            
            row.push({type, visited: false});
        } 
        board.push(row);
    }
      return board;
}
export default function CreateBoard() {
    /* Generate random start and end points*/
    const start = Math.floor(Math.random() * 50);
    const end = Math.floor(Math.random() * 50);

    
    /* set new board, player position, health, moves */
    const [board, setBoard] = useState(createInitialBoard(start, end));
    const [playerPosition, setPlayerPosition] = useState({ x: start, y: 0 });
    const [health, setHealth] = useState(200);
    const [moves, setMoves] = useState(450);

    const handleKeyDown = (e: { key: any; }) => {
        const { x, y } = playerPosition;
        let newX = x;
        let newY = y;
        let newHealth = health;
        let newMoves = moves;

        /* arrow key logic to move on board */
        switch (e.key) {
            case 'ArrowUp':
                newX = x > 0 ? x - 1 : x;
                break;
            case 'ArrowRight':
                newY = y < 49 ? y + 1 : y;
                break;
            case 'ArrowDown':
                newX = x < 49 ? x + 1 : x;
                break;
            case 'ArrowLeft':
                newY = y > 0 ? y - 1 : y;
                break;
            
            default:
                break;
        }
    
        /* update board with arrow key input */
        if (newX !== y || newY !== x) {
            const newBoard = board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (rowIndex === y && colIndex === x) {
                        return { ...cell, visited: true };
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
                default:
                    newHealth = health;
                    newMoves = moves;
            }

            setBoard(newBoard);
            setPlayerPosition({ x: newX, y: newY });
            setHealth(newHealth);
            setMoves(newMoves);

            /*Game End conditions*/
            
        }
    };

    /* lisntener for user input on keyboard */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerPosition, board, health, moves]);

    /* return board in div format */
    return (
        <div id="game">
            <div id="stats">
                <Stats health={health} moves={moves} />
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
            {(health <= 0 || moves <= 0) && (
                <div className="game-over">
                    <h1>Game Over</h1>
                    {health <= 0 ? <p>You ran out of health!</p> : <p>You ran out of moves!</p>}
                </div>
            )}
        </div>
        
    );
}
