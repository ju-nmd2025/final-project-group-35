import { character } from "./character.js";
import { platform } from "./platform.js";

export let platformGenerator = {
  platformWidth: 100,
  platformHeight: 20,

  // horizontal spacing
  minHorizontalGap: 40,

  // vertical spacing range
  minVerticalGap: 100,
  maxVerticalGap: 200,

  // last Y-level
  lastPlatformY: null,

  init(startY) {
    this.lastPlatformY = startY;
  },

  createInitialPlatforms(character, width) {
    let platforms = [];
    //platform under character at y=700 (floor level)
    platforms.push({
      ...platform,
      x: character.x - this.platformWidth / 2,
      y: 700, // Fixed at floor level
      w: this.platformWidth,
      h: this.platformHeight,
      disappearing: false,
      draw(screenY) {
       push();
       fill ("blue");
        rect(this.x, this.y, this.w, this.h);
        pop();
      },
    });
    // generate more
    this.generatePlatforms(character.y, width, platforms);
    return platforms;
  },

  generatePlatforms(characterY, width, platforms) {
    // choose a starting x
    let characterX = platforms.length > 0 ? platforms[0].x : width / 2;
    // sensible lastPlatformY
    if (this.lastPlatformY == null) {
      // generate above character
      this.lastPlatformY = characterY + 600;
    }
    let currentY = this.lastPlatformY;

    // keep generating
    while (currentY > characterY - 400) {
      // spawn batch
      let numPlatforms = Math.floor(Math.random() * 9) + 5; // 3..8
      for (let i = 0; i < numPlatforms && currentY > characterY - 400; i++) {
        // random vertical gap
        let gap =
          this.minVerticalGap +
          Math.random() * (this.maxVerticalGap - this.minVerticalGap);
        let platformY = currentY - gap;

        let minX = Math.max(0, characterX - 150);
        let maxX = Math.min(width - this.platformWidth, characterX + 150);

        // non-overlapping x
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

          if(!overlaps){
          const isDisappearing = Math.random() < 0.4;
            platforms.push({
              ...platform,
              x: candidateX,
              y: platformY,
              w: this.platformWidth,
              h: this.platformHeight,
              disappearing: isDisappearing,
              draw(screenY) {
                push();
                fill(isDisappearing ? "red" : "blue"); // red = disappearing, blue = permanent
                rect(this.x, this.y, this.w, this.h);
                pop();
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
          const isDisappearing = Math.random() < 0.4;
          platforms.push({
            ...platform,
            x: fallbackX,
            y: platformY,
            w: this.platformWidth,
            h: this.platformHeight,
            disappearing: isDisappearing,
            draw(screenY) {
              push();
              fill(isDisappearing ? "red" : "blue"); // red = disappearing, blue = permanent
              rect(this.x, this.y, this.w, this.h);
              pop();
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

 