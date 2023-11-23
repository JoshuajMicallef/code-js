// assetsLoader.js

class AssetsLoader {
    constructor() {
        this.images = {};
    }

    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;

            img.onload = () => {
                this.images[name] = img;
                resolve(img);
            };

            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
        });
    }

    loadAllImages() {
        const imagesToLoad = {
            'playerIdle': 'assets/players/player-1/Idle.png',
            'playerWalkLeft': 'assets/players/player-1/Walk-Left.png',
            'playerWalkRight': 'assets/players/player-1/Walk-Right.png',
            'playerDead': 'assets/players/player-1/Dead.png',
            'playerHurt': 'assets/players/player-1/Hurt.png',
            'playerAttackLeft': 'assets/players/player-1/Attack-Left.png',
            'playerAttackRight': 'assets/players/player-1/Attack-Right.png',
            'playerShield': 'assets/players/player-1/Shield.png',

            'level1background': 'assets/level-art/level-1/bg.png',
            'level1enemy1attackleft': 'assets/level-art/level-1/enemy-1/Attack-Left.png',
            'level1enemy1attackright': 'assets/level-art/level-1/enemy-1/Attack-Right.png',
            'level1enemy1dead': 'assets/level-art/level-1/enemy-1/Dead.png',
            'level1enemy1run': 'assets/level-art/level-1/enemy-1/Run.png',
            'level1enemy2attackleft': 'assets/level-art/level-1/enemy-2/Attack-Left.png',
            'level1enemy2attackright': 'assets/level-art/level-1/enemy-2/Attack-Right.png',
            'level1enemy2dead': 'assets/level-art/level-1/enemy-2/Dead.png',
            'level1enemy2run': 'assets/level-art/level-1/enemy-2/Run.png',
            'level1enemy3attackleft': 'assets/level-art/level-1/enemy-3/Attack-Left.png',
            'level1enemy3attackright': 'assets/level-art/level-1/enemy-3/Attack-Right.png',
            'level1enemy3dead': 'assets/level-art/level-1/enemy-3/Dead.png',
            'level1enemy3run': 'assets/level-art/level-1/enemy-3/Run.png',


            'level2background': 'assets/level-art/level-2/bg.png',
            'level2enemy1attackleft': 'assets/level-art/level-2/enemy-1/Attack-Left.png',
            'level2enemy1attackright': 'assets/level-art/level-2/enemy-1/Attack-Right.png',
            'level2enemy1dead': 'assets/level-art/level-2/enemy-1/Dead.png',
            'level2enemy1walk': 'assets/level-art/level-2/enemy-1/Walk.png',
            'level2enemy2attackleft': 'assets/level-art/level-2/enemy-2/Attack-Left.png',
            'level2enemy2attackright': 'assets/level-art/level-2/enemy-2/Attack-Right.png',
            'level2enemy2dead': 'assets/level-art/level-2/enemy-2/Dead.png',
            'level2enemy2walk': 'assets/level-art/level-2/enemy-2/Walk.png',
            'level2enemy3attack': 'assets/level-art/level-2/enemy-3/Attack.png',
            'level2enemy3shot': 'assets/level-art/level-2/enemy-3/Shot.png',
            'level2enemy3dead': 'assets/level-art/level-2/enemy-3/Dead.png',
            'level2enemy3walk': 'assets/level-art/level-2/enemy-3/Walk.png',

            'level3background': 'assets/level-art/level-3/bg.png',
            'level3enemy1attack': 'assets/level-art/level-3/enemy-1/Attack.png',
            'level3enemy1dead': 'assets/level-art/level-3/enemy-1/Dead.png',
            'level3enemy1walk': 'assets/level-art/level-3/enemy-1/Walk.png',
            'level3enemy2attack': 'assets/level-art/level-3/enemy-2/Attack.png',
            'level3enemy2shot': 'assets/level-art/level-3/enemy-2/Shot.png',
            'level3enemy2dead': 'assets/level-art/level-3/enemy-2/Dead.png',
            'level3enemy2walk': 'assets/level-art/level-3/enemy-2/Walk.png',
            'level3enemy3attack': 'assets/level-art/level-3/enemy-3/Attack.png',
            'level3enemy3dead': 'assets/level-art/level-3/enemy-3/Dead.png',
            'level3enemy3walk': 'assets/level-art/level-3/enemy-3/Walk.png',

            'level4background': 'assets/level-art/level-4/bg.png',
            'level4enemy1attack': 'assets/level-art/level-4/enemy-1/Attack.png',
            'level4enemy1dead': 'assets/level-art/level-4/enemy-1/Dead.png',
            'level4enemy1walk': 'assets/level-art/level-4/enemy-1/Walk.png',
            'level4enemy2attack': 'assets/level-art/level-4/enemy-2/Attack.png',
            'level4enemy2shot': 'assets/level-art/level-4/enemy-2/Shot.png',
            'level4enemy2dead': 'assets/level-art/level-4/enemy-2/Dead.png',
            'level4enemy2walk': 'assets/level-art/level-4/enemy-2/Walk.png',
            'level4enemy3attack': 'assets/level-art/level-4/enemy-3/Attack.png',
            'level4enemy3dead': 'assets/level-art/level-4/enemy-3/Dead.png',
            'level4enemy3walk': 'assets/level-art/level-4/enemy-3/Walk.png',

            'health': 'assets/power-ups/health.png',
            'enegry': 'assets/power-ups/energy.png',
            
        };

        const promises = Object.entries(imagesToLoad).map(([name, src]) =>
            this.loadImage(name, src)
        );

        return Promise.all(promises);
    }

}

export const assetsLoader = new AssetsLoader();
