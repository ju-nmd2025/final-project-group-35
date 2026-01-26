<<<<<<< Updated upstream
import character from "./character.js";
import platform from "./platform.js";
=======
// Skapar och uppdaterar plattformar: storlekar, avstånd, generering och städning
import { character } from "./character.js";
import { platform } from "./platform.js";
>>>>>>> Stashed changes

export default class PlatformGenerator {
  platformWidth = 100;
  platformHeight = 20;

<<<<<<< Updated upstream
  // horizontal spacing
  minHorizontalGap = 40;

  // vertical spacing range
  minVerticalGap = 80;
  maxVerticalGap = 90;

  // last Y-level
  lastPlatformY = null;
=======
  // Minsta horisontella mellanrum mellan plattformar
  minHorizontalGap: 40,

  // Vertikala mellanrum (min och max)
  minVerticalGap: 80,
  maxVerticalGap: 90,

  // Senaste Y-nivån där vi skapade en plattform
  lastPlatformY: null,
>>>>>>> Stashed changes

  // Nollställer generatorn med en start-y
  init(startY) {
    this.lastPlatformY = startY;
  }

<<<<<<< Updated upstream
  createInitialPlatforms(Character, width) {
=======
  // Skapa de första plattformarna, inklusive en vid golvet under gubben
  createInitialPlatforms(character, width) {
>>>>>>> Stashed changes
    let platforms = [];
    // Plattform under spelaren på y=700 (golvnivå)
    platforms.push({
      ...platform,
<<<<<<< Updated upstream
      x: Character.x - this.platformWidth / 2,
      y: 700, // Fixed at floor level
=======
      x: character.x - this.platformWidth / 2,
      y: 700, // Fast på grundnivån
>>>>>>> Stashed changes
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
    // Skapa fler plattformar ovanför
    this.generatePlatforms(character.y, width, platforms);
    return platforms;
<<<<<<< Updated upstream
  }

=======
  },

  // Generera fler plattformar uppåt från senaste nivån
>>>>>>> Stashed changes
  generatePlatforms(characterY, width, platforms) {
    // Välj start-x utifrån första plattformen eller mitten
    let characterX = platforms.length > 0 ? platforms[0].x : width / 2;
    // Sätt rimligt startvärde om det saknas
    if (this.lastPlatformY == null) {
      // Skapa ovanför gubben
      this.lastPlatformY = characterY + 600;
    }
    let currentY = this.lastPlatformY;

    // Fortsätt skapa tills vi nått tillräckligt högt upp
    while (currentY > characterY - 400) {
      // Skapa en grupp plattformar
      let numPlatforms = Math.floor(Math.random() * 3) + 2; // 2..4
      for (let i = 0; i < numPlatforms && currentY > characterY - 400; i++) {
        // Slumpa vertikalt mellanrum
        let gap =
          this.minVerticalGap +
          Math.random() * (this.maxVerticalGap - this.minVerticalGap);
        let platformY = currentY - gap;

        let minX = Math.max(0, characterX - 150);
        let maxX = Math.min(width - this.platformWidth, characterX + 150);

        // Försök hitta x som inte krockar för nära andra plattformar
        let placed = false;
        let maxTries = 12;
        let tries = 0;
        while (!placed && tries < maxTries) {
          let candidateX = minX + Math.random() * (maxX - minX);

          let overlaps = platforms.some((p) => {
            const verticalDist = Math.abs(p.y - platformY);
<<<<<<< Updated upstream
            // far apart vertically -> no overlap
=======
            // Långt ifrån vertikalt: ingen kollision att bry sig om
>>>>>>> Stashed changes
            if (verticalDist > this.maxVerticalGap) return false;
            const pLeft = p.x;
            const pRight = p.x + (p.w || this.platformWidth);
            const cLeft = candidateX;
            const cRight = candidateX + this.platformWidth;

<<<<<<< Updated upstream
            const verticalBuffer = this.platformHeight + 10; // treat this as "very close"
            if (verticalDist < verticalBuffer) {
              // require horizontal gap when very close vertically
=======
            const verticalBuffer = this.platformHeight + 10; // betraktas som väldigt nära
            if (verticalDist < verticalBuffer) {
              // Kräv horisontellt mellanrum om det är väldigt nära i höjdled
>>>>>>> Stashed changes
              return !(
                cRight + this.minHorizontalGap <= pLeft ||
                cLeft >= pRight + this.minHorizontalGap
              );
            }

            // Om ganska nära i höjdled: undvik direkt överlapp
            if (verticalDist < this.minVerticalGap) {
              return !(cRight <= pLeft || cLeft >= pRight);
            }

            return false;
          });

          if (!overlaps) {
<<<<<<< Updated upstream
            const isGreenMoving = Math.random() < 0.2;
            const isDisappearing = !isGreenMoving && Math.random() < 0.2;
=======
            const isGreenMoving = Math.random() < 0.2; // gröna plattformar rör sig
            const isDisappearing = !isGreenMoving && Math.random() < 0.2; // röda försvinner
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                if (!this.moving) return;
=======
                if (!this.moving) return; // bara om plattformen ska röra sig
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        // fallback placement
=======
        // Om vi inte hittade plats: lägg en nödlösningsplattform
>>>>>>> Stashed changes
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

  // Ta bort plattformar som ligger för långt ovanför kameran
  cleanPlatforms(platforms, cameraY) {
    return platforms.filter((p) => p.y > cameraY - 200);
<<<<<<< Updated upstream
  }
}

export { PlatformGenerator };
=======
  },
};
>>>>>>> Stashed changes
