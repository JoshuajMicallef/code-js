// level-1.js

import { canvas } from '../../core/game.js';
import { setupBackground } from './environment.js';
import Enemy from '../../core/characters/enemies/level-1/enemy.js';
import { assetsLoader } from '../../core/assetsLoader.js';
import { enemies, player } from '../../core/game.js';

function startLevel1() {
    setupBackground(canvas);

    let enemyCount = 0;
    const maxEnemies = 1000; // Maximum number of enemies for this level
    const spawnInterval = 3000; // Spawn a new enemy every 3000 ms (3 seconds)

    const spawnEnemy = () => {
        if (enemyCount < maxEnemies) {
            const enemyType = `enemy${Math.floor(Math.random() * 3) + 1}`;
    
            // Choose a random edge: left (0) or right (1)
            const edge = Math.floor(Math.random() * 2);
    
            let x, y;
            if (edge === 0) { // Left edge
                x = 0; // Spawn at the left edge
            } else { // Right edge
                x = canvas.width; // Spawn at the right edge
            }
    
            // Random y position within the bottom 25% of the canvas
            y = canvas.height - canvas.height / 3 - (canvas.height / 4);
    
            const newEnemy = new Enemy(x, y, assetsLoader, enemyType, player);
            enemies.push(newEnemy);
            enemyCount++;
        } else {
            clearInterval(spawnTimer); // Stop spawning enemies
        }
    };
    

    const spawnTimer = setInterval(spawnEnemy, spawnInterval);
}

export function initLevel1() {
    startLevel1();
}
