import { platform } from "./platform.js";

export let platformGenerator = {
  // width/height used when creating platform objects
  platformWidth: 100,
  platformHeight: 20,

  // horizontal spacing: platforms at similar heights will be at least this many pixels apart
  minHorizontalGap: 40,

  // vertical spacing range (pixels) between individual platforms
  minVerticalGap: 100,
  maxVerticalGap: 240,

  // last Y where we generated platforms
  lastPlatformY: null,

  init(startY) {
    this.lastPlatformY = startY;
  },

  createInitialPlatforms(character, width) {
    let platforms = [];
    // put a platform right under the character
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
    // generate more above
    this.generatePlatforms(character.y, width, platforms);
    return platforms;
  },

  generatePlatforms(characterY, width, platforms) {
    // choose a starting x based on existing platforms
    let characterX = platforms.length > 0 ? platforms[0].x : width / 2;
    // ensure we have a sensible lastPlatformY (init may have been missed)
    if (this.lastPlatformY == null) {
      // start generation a bit above the character so we populate above
      this.lastPlatformY = characterY + 600;
    }
    let currentY = this.lastPlatformY;

    // Keep generating until we've gone far enough above the character
    while (currentY > characterY - 400) {
      // spawn a small batch
      let numPlatforms = Math.floor(Math.random() * 6) + 3; // 3..8
      for (let i = 0; i < numPlatforms && currentY > characterY - 400; i++) {
        // pick a random vertical gap for this platform
        let gap =
          this.minVerticalGap +
          Math.random() * (this.maxVerticalGap - this.minVerticalGap);
        let platformY = currentY - gap;

        let minX = Math.max(0, characterX - 150);
        let maxX = Math.min(width - this.platformWidth, characterX + 150);

        // try to find a non-overlapping x
        let placed = false;
        let maxTries = 12;
        let tries = 0;
        while (!placed && tries < maxTries) {
          let candidateX = minX + Math.random() * (maxX - minX);
          let overlaps = platforms.some((p) => {
            if (Math.abs(p.y - platformY) > this.platformHeight + 10)
              return false;
            let pLeft = p.x;
            let pRight = p.x + (p.w || this.platformWidth);
            let cLeft = candidateX;
            let cRight = candidateX + this.platformWidth;
            return !(
              cRight + this.minHorizontalGap <= pLeft ||
              cLeft >= pRight + this.minHorizontalGap
            );
          });

          if (!overlaps) {
            platforms.push({
              ...platform,
              x: candidateX,
              y: platformY,
              w: this.platformWidth,
              h: this.platformHeight,
              draw(screenY) {
                platform.draw.call(this, screenY);
              },
            });
            characterX = candidateX;
            placed = true;
            break;
          }
          tries++;
        }

        // fallback placement
        if (!placed) {
          let fallbackX = minX + Math.random() * (maxX - minX);
          platforms.push({
            ...platform,
            x: fallbackX,
            y: platformY,
            w: this.platformWidth,
            h: this.platformHeight,
            draw(screenY) {
              platform.draw.call(this, screenY);
            },
          });
          characterX = fallbackX;
        }

        currentY = platformY;
      }
    }

    this.lastPlatformY = currentY;
  },

  cleanPlatforms(platforms, cameraY) {
    return platforms.filter((p) => p.y > cameraY - 200);
  },
};
