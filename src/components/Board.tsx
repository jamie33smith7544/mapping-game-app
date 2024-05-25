import './Board.css';

export default function createBoard () {
    let board = [];

    const start = Math.floor(Math.random() * 49) + 1;
    const end = Math.floor(Math.random() * 49) + 1;
    for (let j = 0; j < 50; j++) { //row
        for (let i = 0; i < 50; i++) { //column
            if (i === 0 && j === start){
                board.push(
                    <div id="start" className="space start-space"></div>
                );
            }
            else if (i === 49 && j === end){
                board.push(
                    <div id="end" className="space end-space"></div>
                );
            }
            else{
                const number = Math.floor(Math.random() * 4) + 1; //get minimum
            
                if (number === 1){
                    board.push(
                        <div id="blank" className="space blank-space"></div>
                    );
                }
                else if (number === 2){
                    board.push(
                        <div id="speeder" className="space speeder-space"></div>
                    );
                }
                else if (number === 3){
                    board.push(
                        <div id="lava" className="space lava-space"></div>
                    );
                }
                else {
                    board.push(
                        <div id="mud" className="space mud-space"></div>
                    );
                }
            }  
        }
      }

    return <div id="board">{board}</div>;
}
