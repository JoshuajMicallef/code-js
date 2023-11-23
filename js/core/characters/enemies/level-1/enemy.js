// enemy.js
import { canvas} from '../../../game.js';
import { gameState } from '../../../game.js'; // Adjust the path as necessary


export default class Enemy {
    constructor(x, y, assetsLoader, type, player) {
        this.x = x;
        this.y = y;
        this.attackRange = 50; // Example range within which the enemy can attack
        this.attackDamage = 10; // Damage dealt by the enemy
        this.state = 'run'; // initial state
        this.currentFrameIndex = 0;
        this.isAttacking = false;
        this.health = 1; 
        this.lastAttackTime = 0; // Timestamp of the last attack
        this.player = player;
        this.isDeathAnimationDone = false;

    
        // Animation-related properties
        this.frameIndex = 0; // Current frame index
        this.tickCount = 0; // Counts the ticks for frame rate control
        this.ticksPerFrame = 10; // Number of ticks per frame
    
        if (type === 'enemy1') {
            this.speed = 1;
            this.attackDamage = 10;
            this.setupFrames(assetsLoader, 'level1enemy1');
            // Set width and height for enemy1
            this.width = 127;
            this.height = 127;
        } else if (type === 'enemy2') {
            this.speed = 1.5;
            this.attackDamage = 10;
            this.setupFrames(assetsLoader, 'level1enemy2');
            // Set width and height for enemy2
            this.width = 127;
            this.height = 127;
        } else if (type === 'enemy3') {
            this.speed = 2;
            this.attackDamage = 10;
            this.setupFrames(assetsLoader, 'level1enemy3');
            // Set width and height for enemy3
            this.width = 127;
            this.height = 127;
        }
    }

    setupFrames(assetsLoader, enemyPrefix) {
        const frameWidth = 127; // Example width of each frame
        const frameHeight = 127; // Example height of each frame
    
        this.frames = {
            attackLeft: this.createFrames(assetsLoader.images[`${enemyPrefix}attackleft`], 4, frameWidth, frameHeight),
            attackRight: this.createFrames(assetsLoader.images[`${enemyPrefix}attackright`], 4, frameWidth, frameHeight),
            dead: this.createFrames(assetsLoader.images[`${enemyPrefix}dead`], 2, frameWidth, frameHeight),
            run: this.createFrames(assetsLoader.images[`${enemyPrefix}run`], 9, frameWidth, frameHeight)
        };
    }

    createFrames(spriteSheet, frameCount, frameWidth, frameHeight) {
        let frames = [];
        for (let i = 0; i < frameCount; i++) {
            frames.push({
                image: spriteSheet,
                x: i * frameWidth,
                y: 0, // Assuming all frames are in a single row
                width: frameWidth,
                height: frameHeight
            });
        }
        return frames;
    }

    // In Enemy.attack()
    attack(player) {
        if (!gameState.playerAlive) {
            // Optionally, reset the enemy's state if needed
            this.isAttacking = false;
            // Skip the attack logic if the player is dead
            return;
        }
        
        const currentTime = Date.now();
        const attackCooldown = 2000; // 2 seconds cooldown
        if (currentTime - this.lastAttackTime > attackCooldown) {
            player.takeDamage(this.attackDamage);
            this.lastAttackTime = currentTime;
            // If you're using 'isAttacking' for animations or other logic, 
            // ensure it's appropriately set here
        }
    }
    

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }

        console.log(`Enemy took damage at x=${this.x}, y=${this.y}, health remaining: ${this.health}`);

    }
    
    die() {
        this.state = 'dead';
        this.currentFrameIndex = 0; // Start from the first frame of the dying animation
        this.fadeCounter = 100; // Full opacity
    }
    

    update() {
        // Add a check to see if the player is dead
        if (this.player.isDeathAnimationDone) {
            // If the player is dead, reset the enemy's state or handle it as needed
            this.isAttacking = false;
            this.state = 'idle'; // or any other state you wish to set
            return; // Skip the rest of the update logic
        }

        if (this.state === 'dead') {
            if (!this.isDeathAnimationDone) {
                this.tickCount++;
                if (this.tickCount > this.ticksPerFrame) {
                    this.tickCount = 0;
                    if (this.currentFrameIndex < this.frames['dead'].length - 1) {
                        this.currentFrameIndex++;
                    } else {
                        this.isDeathAnimationDone = true;
                    }
                }
            }
            
            if (this.isDeathAnimationDone) {
                // Decrease fadeCounter to create a fading effect
                this.fadeCounter -= 2;  // Adjust the rate of fading as needed
                if (this.fadeCounter <= 0) {
                    this.toBeRemoved = true;  // Mark for removal if needed
                }
            }
            return; // Stop updating if dead
        }
    
        
        // Calculate the direction towards the player
        const dx = this.player.x - this.x;
        const distance = Math.abs(dx);
        this.direction = dx > 0 ? 'right' : 'left';
    
        if (distance > this.attackRange) {
            const vx = (dx / distance) * this.speed;
            this.x += vx;
            this.state = 'run';
            this.isAttacking = false;
        } else if (!this.isAttacking && Date.now() - this.lastAttackTime > 2000) {
            this.isAttacking = true;
            this.state = dx > 0 ? 'attackRight' : 'attackLeft';
            this.attack(this.player);
        }
    
        if (this.isAttacking && (Date.now() - this.lastAttackTime > this.attackCooldown)) {
            this.isAttacking = false;
            this.state = 'run';
        }

        let currentTicksPerFrame = this.ticksPerFrame;
        if (this.state.includes('attack')) {
            currentTicksPerFrame = 20; // Increase this value to slow down attack animations
        }

        this.tickCount++;
        if (this.tickCount > currentTicksPerFrame) {
            this.tickCount = 0;
            this.currentFrameIndex++;
            if (this.currentFrameIndex >= this.frames[this.state].length) {
                this.currentFrameIndex = 0;
                if (this.state.includes('attack')) {
                    // Consider adding a delay or condition before switching state back to 'run'
                    // to ensure the attack animation completes fully
                    this.isAttacking = false;
                    // this.state = 'run'; // You might want to delay this transition
                }
            }
        }
    }
    
    
    
    draw(ctx) {
        const newWidth = (canvas.width / 2) - ((canvas.width / .8) / 4);
        const newHeight = canvas.height - (canvas.height / 3) - (canvas.height / 3);
    
        if (this.state === 'dead') {
            let dyingFrame = this.frames['dead'][this.currentFrameIndex];
            ctx.save();
            ctx.globalAlpha = this.fadeCounter / 100;
            ctx.drawImage(
                dyingFrame.image,
                dyingFrame.x, dyingFrame.y,
                dyingFrame.width, dyingFrame.height,
                this.x, this.y,
                newWidth, newHeight
            );
            ctx.restore();

            if (this.isDeathAnimationDone && this.toBeRemoved) {
                // Optionally handle the enemy removal from the game
                return;
            }
        } else {
            let currentFrame = this.frames[this.state][this.currentFrameIndex];
            if (currentFrame) {
                ctx.save();
                if (this.direction === 'left') {
                    ctx.scale(-1, 1);
                    ctx.translate(-2 * this.x - newWidth, 0);
                }
                ctx.drawImage(
                    currentFrame.image,
                    currentFrame.x, currentFrame.y,
                    currentFrame.width, currentFrame.height,
                    this.x, this.y,
                    newWidth, newHeight
                );
                ctx.restore();
            }   
        }
        
    }

}