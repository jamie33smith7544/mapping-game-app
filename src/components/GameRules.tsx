import "./GameRules.css";

export default function GameRules(){
    return (
      <div id="rule-section">
        <h1>Game Rules:</h1>
        <p>You start with 200 health and 450 moves.  You must make it from point A (left) to point B (right).</p>
        <p>Use the arrow keys to navigate across the board.  As you go, health and moves will be affected based on the type of space you move to.</p>
        <h3>Color Legend</h3>
        <li className="legend">
          <span className="color-box start"></span>
          <span>Starting Point</span>
        </li>
        <li className="legend">
          <span className="color-box end"></span>
          <span>End Point</span>
        </li>
        <li className="legend">
          <span className="color-box blank"></span>
          <span>Blank Space: Lose 1 Move</span>
        </li>
        <li className="legend">
          <span className="color-box speeder"></span>
          <span>Speeder Space: Lose 5 Health</span>
        </li>
        <li className="legend">
          <span className="color-box lava"></span>
          <span>Lava Space: Lose 50 Health and 10 Moves</span>
        </li>
        <li className="legend">
          <span className="color-box mud"></span>
          <span>Mud Space: Lose 10 Health and 5 Moves</span>
        </li>
        <li className="legend">
          <span className="color-box current-position"></span>
          <span>Space player is on (after starting)</span>
        </li>
        <li className="legend">
          <span className="color-box path"></span>
          <span>Spaces already visited</span>
        </li>
      </div>
    )
}