import './Board.css';

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
            
            row.push({type, visitied: false});
        } 
        board.push(row);
    }
      return board;
}
export default function CreateBoard() {
    /* Generate random start and end points*/
    const start = Math.floor(Math.random() * 50);
    const end = Math.floor(Math.random() * 50);

    const board = createInitialBoard(start, end)
    return (
        <div id="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {row.map((cell, colIndex) => {
                        let className = 'space ' + cell.type + '-space';
                        return <div key={colIndex} className={className}></div>;
                    })}
                </div>
            ))}
        </div>
    );
}
