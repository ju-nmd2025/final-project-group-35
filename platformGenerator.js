import { platform } from "./platform.js";

export let platformGenerator = {
  createInitialPlatforms(character, width) {
    // Add a starting platform directly under the character
    const platforms = [];
    platforms.push({
      ...platform,
      x: character.x - this.platformWidth / 2,
      y: character.y + character.h,
      w: this.platformWidth,
      h: this.platformHeight,
      draw(screenY) {
        platform.draw.call(this, screenY);
      },
    });
    this.generatePlatforms(character.y, width, platforms);
    return platforms;
  },
  platformSpacing: 150,
  platformWidth: 100,
  platformHeight: 20,
  lastPlatformY: null,

  init(startY) {
    this.lastPlatformY = startY;
    // Removed duplicate import
  },

  generatePlatforms(characterY, width, platforms) {
    // Find character's current x position
    let characterX = platforms.length > 0 ? platforms[0].x : width / 2;
    while (this.lastPlatformY > characterY - 400) {
      // For each level, spawn between 3 and 8 platforms
      let numPlatforms = Math.floor(Math.random() * 6) + 3; // 3 to 8
      let newY = this.lastPlatformY - this.platformSpacing;
      for (let i = 0; i < numPlatforms; i++) {
        let staggerY = newY - i * (this.platformHeight + 10);
        let minX = Math.max(0, characterX - 150);
        let maxX = Math.min(width - this.platformWidth, characterX + 150);
        let newX = minX + Math.random() * (maxX - minX);
        platforms.push({
          ...platform,
          x: newX,
          y: staggerY,
          draw(screenY) {
            platform.draw.call(this, screenY);
          },
        });
        characterX = newX;
      }
      this.lastPlatformY = newY - numPlatforms * (this.platformHeight + 10);
    }
  },

  cleanPlatforms(platforms, cameraY) {
    return platforms.filter((p) => p.y > cameraY - 200);
  },
};
