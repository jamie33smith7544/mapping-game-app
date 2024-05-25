import './App.css';
import Stats from "./components/Stats";
import Board from "./components/Board";

function App(){
  return (
    <div id="game">
      <div id="stats">
        <Stats />
      </div>
      <div id="board">
        <Board/>
      </div>
    </div>
    
  )
}

export default App;