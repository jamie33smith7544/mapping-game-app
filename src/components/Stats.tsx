
// Define health and moves props
interface StatsProps {
    health: number;
    moves:number;
}
const Stats: React.FC<StatsProps> = ({ health, moves }) => { 
    return (
        <div id="stats">
            <h1>Health: {health}</h1>
            <h1>Moves: {moves}</h1>
            <button>New Game</button>
            <button>Reset</button>
        </div>
        
    )
}

export default Stats;