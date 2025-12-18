import character from "./character.js";
import platform from "./platform.js";

export default class PlatformGenerator {
  platformWidth = 100;
  platformHeight = 20;

  // horizontal spacing
  minHorizontalGap = 40;

  // vertical spacing range
  minVerticalGap = 80;
  maxVerticalGap = 90;

  // last Y-level
  lastPlatformY = null;

  init(startY) {
    this.lastPlatformY = startY;
  }

  createInitialPlatforms(Character, width) {
    let platforms = [];
    //platform under character at y=700 (floor level)
    platforms.push({
      ...platform,
      x: Character.x - this.platformWidth / 2,
      y: 700, // Fixed at floor level
      w: this.platformWidth,
      h: this.platformHeight,
      disappearing: false,
      moving: false,
      isGreenMoving: false,

      draw(screenY) {
        push();
        fill("blue");
        rect(this.x, this.y, this.w, this.h);
        pop();
      },
      move() {
        return;
      },
    });
    // generate more
    this.generatePlatforms(character.y, width, platforms);
    return platforms;
  }

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
      let numPlatforms = Math.floor(Math.random() * 3) + 2; // 2..4
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
            const verticalDist = Math.abs(p.y - platformY);
            // far apart vertically -> no overlap
            if (verticalDist > this.maxVerticalGap) return false;
            const pLeft = p.x;
            const pRight = p.x + (p.w || this.platformWidth);
            const cLeft = candidateX;
            const cRight = candidateX + this.platformWidth;

            const verticalBuffer = this.platformHeight + 10; // treat this as "very close"
            if (verticalDist < verticalBuffer) {
              // require horizontal gap when very close vertically
              return !(
                cRight + this.minHorizontalGap <= pLeft ||
                cLeft >= pRight + this.minHorizontalGap
              );
            }

            // if moderately close vertically, just avoid direct horizontal overlap
            if (verticalDist < this.minVerticalGap) {
              return !(cRight <= pLeft || cLeft >= pRight);
            }

            return false;
          });

          if (!overlaps) {
            const isGreenMoving = Math.random() < 0.2;
            const isDisappearing = !isGreenMoving && Math.random() < 0.2;
            const isMoving = isGreenMoving;

            platforms.push({
              ...platform,
              x: candidateX,
              y: platformY,
              w: this.platformWidth,
              h: this.platformHeight,
              disappearing: isDisappearing,
              moving: isMoving,
              isGreenMoving: isGreenMoving,
              moveDirection: 1,
              originalX: candidateX,
              moveSpeed: isMoving ? 1 + Math.random() * 2 : 0,
              moveRange: isMoving ? 50 + Math.random() * 100 : 0,

              draw(screenY) {
                push();
                if (this.isGreenMoving) {
                  fill("green");
                } else if (this.disappearing) {
                  fill("red");
                } else {
                  fill("blue");
                }
                rect(this.x, this.y, this.w, this.h);
                pop();
              },
              move() {
                if (!this.moving) return;
                this.x += this.moveSpeed * this.moveDirection;
                if (this.x > this.originalX + this.moveRange) {
                  this.x = this.originalX + this.moveRange;
                  this.moveDirection = -1;
                }
                if (this.x < this.originalX - this.moveRange) {
                  this.x = this.originalX - this.moveRange;
                  this.moveDirection = 1;
                }
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
          const isGreenMoving = Math.random() < 0.2;
          const isDisappearing = !isGreenMoving && Math.random() < 0.2;
          const isMoving = isGreenMoving;
          platforms.push({
            ...platform,
            x: fallbackX,
            y: platformY,
            w: this.platformWidth,
            h: this.platformHeight,
            disappearing: isDisappearing,
            moving: isMoving,
            isGreenMoving: isGreenMoving,
            originalX: fallbackX,
            moveDirection: 1,
            moveSpeed: isMoving ? 1 + Math.random() * 2 : 0,
            moveRange: isMoving ? 40 + Math.random() * 80 : 0,
            draw(screenY) {
              push();
              if (this.isGreenMoving) {
                fill("green");
              } else if (this.disappearing) {
                fill("red");
              } else {
                fill("blue");
              }
              rect(this.x, this.y, this.w, this.h);
              pop();
            },
            move() {
              if (!this.moving) return;
              this.x += this.moveSpeed * this.moveDirection;
              if (this.x > this.originalX + this.moveRange) {
                this.x = this.originalX + this.moveRange;
                this.moveDirection = -1;
              }
              if (this.x < this.originalX - this.moveRange) {
                this.x = this.originalX - this.moveRange;
                this.moveDirection = 1;
              }
            },
          });
          characterX = fallbackX;
        }

        currentY = platformY;
      }
    }

    this.lastPlatformY = currentY;
  }

  cleanPlatforms(platforms, cameraY) {
    return platforms.filter((p) => p.y > cameraY - 200);
  }
}

export { PlatformGenerator };
