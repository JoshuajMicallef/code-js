// main.js

import { initLevel1 } from './levels/level-1/level-1.js';
import { canvas } from './core/game.js';

function startGame() {
    // Set up canvas dimensions and other initial settings
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Start the first level of the game
    initLevel1();
}



document.addEventListener('DOMContentLoaded', startGame);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});