// environment.js

import { canvas, ctx } from '../../core/game.js';
import { assetsLoader } from '../../core/assetsLoader.js';

export function setupBackground() {
    const backgroundImage = assetsLoader.images.level3background;
    if (!backgroundImage) {
        console.error('Background image not loaded');
        return;
    }

    // Calculate scale to maintain aspect ratio and cover the entire canvas
    const scale = Math.max(canvas.width / backgroundImage.width, canvas.height / backgroundImage.height);
    const scaledWidth = backgroundImage.width * scale;
    const scaledHeight = backgroundImage.height * scale;

    // Calculate position to center the image in case it overflows the canvas
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // Draw the image scaled and centered
    ctx.drawImage(backgroundImage, offsetX, offsetY, scaledWidth, scaledHeight);
}
