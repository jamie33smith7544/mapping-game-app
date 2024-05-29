import CreateBoard from "./components/PlayGame";
import GameRules from "./components/GameRules";
import './App.css';

function App(){
  return (
    <div id="app">
      <div id="rules">
        <GameRules />
      </div>
      <div id="game">
        <CreateBoard/>
      </div>
    </div>
  )
}

export default App;