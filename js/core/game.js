// game.js

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
import { assetsLoader } from './assetsLoader.js';
import Player from './characters/player.js';
import { initLevel1 } from '../levels/level-1/level-1.js';
import { setupBackground } from '../levels/level-3/environment.js';

export let gameState = {
    playerAlive: true,
};

export let player;
export let enemies = [];
let keys = {
    right: false,
    left: false,
};

function initializeGame() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    

    assetsLoader.loadAllImages().then(() => {
        console.log('All assets loaded successfully.');

        // Initialize the player
        player = new Player(canvas, keys);

        // Initialize the first level
        initLevel1(); 
        
        // Start the game loop
        gameLoop();

    }).catch(error => {
        console.error('Error loading assets:', error);
    });
}

function gameLoop() {
    // Update game state
    update();

    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw(ctx);
    });

    // Render the game
    render();
    
    // Request next frame
    requestAnimationFrame(gameLoop);

    enemies = enemies.filter(enemy => !enemy.toBeRemoved);
}


function update() {
    const currentTime = Date.now();
    // Update the player
    if (player) {
        player.update();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setupBackground();

    // Draw the player
    if (player) {
        player.draw(ctx);
        player.drawBars(ctx);
    }

    enemies.forEach(enemy => enemy.draw(ctx));
}

function keyDownHandler(event) {
    if (event.key === "D" || event.key === "d") {
        keys.right = true;
    } else if (event.key === "A" || event.key === "a") {
        keys.left = true;
    }

    if (event.key === "H" || event.key === "h") {
        player.attackLeft(enemies);
    }

    if (event.key === "J" || event.key === "j") {
        player.attackRight(enemies);
    }
}

function keyUpHandler(event) {
    if (event.key === "D" || event.key === "d") {
        keys.right = false;
    } else if (event.key === "A" || event.key === "a") {
        keys.left = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('DOMContentLoaded', initializeGame);