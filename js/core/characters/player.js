// player.js

import { assetsLoader } from '../assetsLoader.js';
import { canvas, ctx } from '../../core/game.js';


class Player {
    constructor(canvas, keys) {
        this.width = canvas.width / 6; // Width of the player sprite
        this.height = canvas.height / 2.5; // Height of the player sprite
        this.x = canvas.width / 2 - this.width / 2; // Center horizontally
        this.y = canvas.height - this.height - (canvas.height / 4); // Center in the bottom 200px
        this.state = 'idle'; // Initial state
        this.keys = keys;
        this.lastDirection = 'right'; // Default direction
        this.isAttacking = false;
        this.health = 30; // Player can take 3 hits
        this.energy = 100; // Total energy
        this.lastAttackTime = 0; // Timestamp of the last attack
        this.isInvulnerable = false;
        this.isDeathAnimationDone = false;

        const baseAttackRange = 170;
        const baseAttackRangeRight = 0;
        const scaleFactor = canvas.width / 1920;

        this.attackRange = baseAttackRange * scaleFactor;
        this.attackRangeRight = baseAttackRangeRight * scaleFactor;
        this.attackDamage = 100; // Attack damage

        // Define the frame details for each state
        this.frames = {
            'attackLeft': { count: 3, currentFrame: 0, sprite: assetsLoader.images.playerAttackLeft },
            'attackRight': { count: 3, currentFrame: 0, sprite: assetsLoader.images.playerAttackRight },
            'dead': { count: 3, currentFrame: 0, sprite: assetsLoader.images.playerDead },
            'hurt': { count: 2, currentFrame: 0, sprite: assetsLoader.images.playerHurt },
            'idle': { count: 6, currentFrame: 0, sprite: assetsLoader.images.playerIdle },
            'shield': { count: 2, currentFrame: 0, sprite: assetsLoader.images.playerShield },
            'walkleft': { count: 8, currentFrame: 8, sprite: assetsLoader.images.playerWalkLeft },
            'walkright': { count: 8, currentFrame: 0, sprite: assetsLoader.images.playerWalkRight },
        };

        // Animation-related properties
        this.frameIndex = 0; // Current frame index
        this.tickCount = 0; // Counts the ticks for frame rate control
        this.ticksPerFrame = 4; // Number of ticks per frame
    }

    attackRight(enemies) {
        const currentTime = Date.now();
        if (!this.isAttacking && currentTime - this.lastAttackTime >= 100) { // cooldown
            if (this.energy >= 20) { // Check if enough energy to attack
                this.isAttacking = true;
                this.state = 'attackRight';
                this.frameIndex = 0;
                this.energy -= 20; // Use 1/4 of total energy
                this.lastAttackTime = currentTime; // Update the last attack time
            }
        }
        this.checkAttackCollision(enemies);
    }

    attackLeft(enemies) {
        const currentTime = Date.now();
        if (!this.isAttacking && currentTime - this.lastAttackTime >= 100) { // cooldown
            if (this.energy >= 20) { // Check if enough energy to attack
                this.isAttacking = true;
                this.state = 'attackLeft';
                this.frameIndex = 0;
                this.energy -= 20; // Use 1/4 of total energy
                this.lastAttackTime = currentTime; // Update the last attack time
            }
        }
        this.checkAttackCollision(enemies);
    }

    checkAttackCollision(enemies) {
        if (!this.isAttacking) {
            return;
        }
    
        let attackHitbox;
        if (this.lastDirection === 'right') {
            attackHitbox = {
                x: this.x, // Consider starting from the player's current position
                y: this.y,
                width: this.width + this.attackRangeRight, // Extend the width to include the player's width
                height: this.height
            };
        } else { // 'left'
            attackHitbox = {
                x: this.x - this.attackRange, // Start from a position extending leftwards from the player
                y: this.y,
                width: this.attackRange + this.width, // Extend the width to include the player's width
                height: this.height
            };
        }
    
        // Check for collision with each enemy
        enemies.forEach(enemy => {
            if (this.isColliding(attackHitbox, enemy)) {
                enemy.takeDamage(this.attackDamage);
            }
        });
    }
    

    isColliding(enemy, player) {
        let enemyLeft = enemy.x;
        let enemyRight = enemy.x + enemy.width;
        let enemyTop = enemy.y;
        let enemyBottom = enemy.y + enemy.height;
    
        let playerLeft = player.x;
        let playerRight = player.x + player.width;
        let playerTop = player.y;
        let playerBottom = player.y + player.height;
    
        // Check if any of the edges of the enemy's hitbox are within the player's hitbox
        return !(enemyRight < playerLeft || 
                 enemyLeft > playerRight || 
                 enemyBottom < playerTop || 
                 enemyTop > playerBottom);
    }

    takeDamage(damage) {
        if (!this.isInvulnerable) {
            this.health -= damage;
    
            if (this.health <= 0) {
                this.setState('dead');
            } else {
                this.setState('hurt');
                this.isInvulnerable = true;
                setTimeout(() => {
                    this.isInvulnerable = false;
                    if (this.state === 'hurt') {
                        this.setState('hurt');
                    }
                }, 1000); // 1 seconds of invulnerability
            }   
        }
    }
    
    
    die() {
        this.state = 'dead';
        this.currentFrameIndex = 0; // Start from the first frame of the death animation
    }
    
    update() {
        const currentTime = Date.now();

        // Regenerate energy if it's not at maximum and a second has passed since the last attack
        if (this.energy < 100 && currentTime - this.lastAttackTime >= 2000) {
            this.energy += 25;
            if (this.energy > 100) {
                this.energy = 100; // Cap the energy at 100
            }
        }

        // Update the player's state and animation frame
        if (this.isAttacking) {
            // Update attack animation
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex++;
                if (this.frameIndex >= this.frames[this.state].count) {
                    this.frameIndex = 0;
                    this.isAttacking = false; // Stop the attack
                    this.state = 'idle'; // Return to idle state after attack
                }
            }
            return; // Skip other updates while attacking
        }

        if (this.state === 'hurt' || this.state === 'dead') {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex++;
                if (this.frameIndex >= this.frames[this.state].count) {
                    this.frameIndex = 0;
                    if (this.state === 'hurt') {
                        this.state = 'idle'; // Return to idle after hurt animation
                    }
                }
            }
            return; // Skip other updates
        }

        if (this.state === 'dead' && !this.isDeathAnimationDone) {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex++;
                if (this.frameIndex >= this.frames['dead'].count) {
                    this.frameIndex = this.frames['dead'].count - 1; // Keep it at the last frame
                    this.isDeathAnimationDone = true; // Mark the death animation as complete
                }
            }
        }

        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;

            if (this.state === 'walkleft') {
                // For walkLeft, reverse the frame order
                this.frameIndex--;
                if (this.frameIndex < 0) {
                    this.frameIndex = this.frames[this.state].count - 1;
                }
            } else {
                // For other states, normal frame order
                this.frameIndex++;
                if (this.frameIndex >= this.frames[this.state].count) {
                    this.frameIndex = 0;
                }
            }
        }

        const speed = 4; // Adjust the speed as needed

        if (this.isAttacking) {
            // Skip movement updates while attacking
            return;
        }

        if (this.keys.right) {
            this.x += speed;
            this.lastDirection = 'right';
            this.state = 'walkright';
        } else if (this.keys.left) {
            this.x -= speed;
            this.lastDirection = 'left';
            this.state = 'walkleft';
        } else {
            this.state = 'idle';
        }
        
        
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }

    drawBars(ctx) {
        // Set the size and position of the bars
        const barWidth = 500;
        const barHeight = 30;
        const healthBarX = 100;
        const energyBarX = 100;
        const healthBarY = canvas.height - 120; // 20px above the bottom
        const energyBarY = canvas.height - 80; // At the bottom
    
        // Draw health bar background
        ctx.fillStyle = 'grey';
        ctx.fillRect(healthBarX, healthBarY, barWidth, barHeight);
    
        // Draw health bar
        if (this.health > 0) {
            ctx.fillStyle = 'red';
            ctx.fillRect(healthBarX, healthBarY, (this.health / 30) * barWidth, barHeight); // Assuming max health is 30
        } else if (this.health === 0) {
            ctx.fillStyle = 'none';
        }
    
        // Draw energy bar background
        ctx.fillStyle = 'grey';
        ctx.fillRect(energyBarX, energyBarY, barWidth, barHeight);
    
        // Draw energy bar
        ctx.fillStyle = 'blue';
        ctx.fillRect(energyBarX, energyBarY, (this.energy / 100) * barWidth, barHeight); // Assuming max energy is 100
    
        // Set text style for labels
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial'; // You can adjust the font size and style as needed
    
        // Draw text for health bar
        ctx.fillText("Health", healthBarX + 220, healthBarY + 20); // Adjust the position as needed
    
        // Draw text for energy bar
        ctx.fillText("Energy", energyBarX + 220, energyBarY + 20); // Adjust the position as needed
    }
    


    draw(ctx) {
        // Retrieve the current frame details based on the player's state
        const frame = this.frames[this.state];
        const frameWidth = frame.sprite.width / frame.count;
        const frameHeight = frame.sprite.height;  // Assuming all frames have the same height

        ctx.save(); // Save the current state of the canvas

        // Draw the current frame of the player's sprite
        ctx.drawImage(
            frame.sprite,
            this.frameIndex * frameWidth, 0, // Source x, y
            frameWidth, frameHeight,         // Source width, height
            this.x, this.y,                  // Destination x, y
            this.width, this.height          // Destination width, height
        );

        // Additional logic for the 'dead' state
        if (this.state === 'dead' && !this.isDeathAnimationDone) {
            // Logic to handle the death animation
            // Currently, it is handled in the general drawing logic above
            // Additional specific actions can be added here if necessary
        }

        if (this.isDeathAnimationDone) {
            // Handle what to show after the death animation is complete
            // E.g., display a final frame or stop drawing the player
        }

        ctx.restore(); // Restore the original state of the canvas
    }


    // Method to change the player's state
    setState(newState) {
        if (this.frames[newState]) {
            this.state = newState;
            this.frameIndex = 0;
            this.tickCount = 0;
        }
    }

    // Additional methods for player movement, actions, etc.
}

export default Player;