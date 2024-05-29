/**
 * arrow key logic to move on board
 * @param key - Key pressed 
 * @param x - current x position 
 * @param y - current y position
 * @returns - adjusted x,y coordinates
 */
export function handleArrowKey(key: any, x: number,y: number) {
    let newX:number = x;
    let newY:number = y;
    switch (key) {
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
    return { x: newX, y: newY };
}

/**
 * update health and moves based on space type
 * @param spaceType 
 * @param health 
 * @param moves 
 * @returns updated health and moves
 */
export function updateStats(spaceType: any, health: number, moves: number){
    let newHealth: number = health;
    let newMoves: number = moves;
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
        case 'visited':
            newMoves = moves - 1;
            break;
        
        default:
            newHealth = health;
            newMoves = moves;
    }
    return {health: newHealth, moves:newMoves}
}

/**
 * checks if the game is won or over
 * @param spaceType 
 * @param health 
 * @param moves 
 * @returns game over condition booleans and updated health and moves if over
 */
export function gameOverConditions(spaceType: string, health: number, moves: number) {
    let won = false;
    let over = false;
    let view = false;
    
    /* Game won condition */
    if (spaceType === 'end'){
        won = true;
        view = true;
    }

    /* Check for game lost conditions */
    if (health <= 0 || moves <= 0) {
        if (health <=0){
            health = 0;
        }
        else {
            moves = 0;
        }
        over= true;
        view = true;
    }
    return { gameWon:won,gameOver:over, viewMode:view, health:health, moves:moves }
}