import { character } from "./character.js";
import { platform } from "./platform.js";

export let platformGenerator = {
  platformWidth: 100,
  platformHeight: 20,

  // Minsta horisontella mellanrum mellan plattformar
  minHorizontalGap: 40,

  // Vertikala mellanrum (min och max)
  minVerticalGap: 80,
  maxVerticalGap: 90,

  // Senaste Y-nivån där vi skapade en plattform
  lastPlatformY: null,

  init(startY) {
    this.lastPlatformY = startY;
  },

  // Skapa de första plattformarna, inklusive en vid golvet under gubben
  createInitialPlatforms(character, width) {
    let platforms = [];
    // Plattform under spelaren på y=700 (golvnivå)
    platforms.push({
      ...platform,
      x: character.x - this.platformWidth / 2,
      y: 700, // Fixed at floor level
      // Fast på grundnivån
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
  },

  // Generera fler plattformar uppåt från senaste nivån
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
            // far apart vertically -> no overlap
            // Långt ifrån vertikalt: ingen kollision att bry sig om
            if (verticalDist > this.maxVerticalGap) return false;
            const pLeft = p.x;
            const pRight = p.x + (p.w || this.platformWidth);
            const cLeft = candidateX;
            const cRight = candidateX + this.platformWidth;

            const verticalBuffer = this.platformHeight + 10; // treat this as "very close"
            // betraktas som väldigt nära
            if (verticalDist < verticalBuffer) {
              // require horizontal gap when very close vertically
              // Kräv horisontellt mellanrum om det är väldigt nära i höjdled
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
            const isGreenMoving = Math.random() < 0.2; // gröna plattformar rör sig
            const isDisappearing = !isGreenMoving && Math.random() < 0.2; // röda försvinner
            const isMoving = isGreenMoving;

            // skapa och lägg till plattformen med alla dess egenskaper
            platforms.push({
              ...platform, // kopiera grundegenskaper från platform
              x: candidateX, // horisontell position
              y: platformY, // vertikal position
              w: this.platformWidth, // bredd
              h: this.platformHeight, // höjd
              disappearing: isDisappearing, // om plattformen ska försvinna
              moving: isMoving, // om plattformen ska röra sig
              isGreenMoving: isGreenMoving, // om det är en grön rörlig plattform
              moveDirection: 1, // rörelseriktning (1 eller -1)
              originalX: candidateX, // ursprunglig x-position för rörelse
              moveSpeed: isMoving ? 1 + Math.random() * 2 : 0, // hastighet för rörelse
              moveRange: isMoving ? 50 + Math.random() * 100 : 0, // hur långt plattformen rör sig

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
                if (!this.moving) return; // bara om plattformen ska röra sig
                this.x += this.moveSpeed * this.moveDirection; // uppdatera x baserat på hastighet och riktning
                if (this.x > this.originalX + this.moveRange) {
                  // om plattformen går för långt åt höger
                  this.x = this.originalX + this.moveRange; // begränsa till max position
                  this.moveDirection = -1; // byt riktning till vänster
                }
                if (this.x < this.originalX - this.moveRange) {
                  // om plattformen går för långt åt vänster
                  this.x = this.originalX - this.moveRange; // begränsa till min position
                  this.moveDirection = 1; // byt riktning till höger
                }
              },
            });
            characterX = candidateX;
            placed = true;
            break;
          }
          tries++;
        }
        // Om vi inte hittade plats: lägg en nödlösningsplattform
        if (!placed) {
          let fallbackX = minX + Math.random() * (maxX - minX);
          const isGreenMoving = Math.random() < 0.2;
          const isDisappearing = !isGreenMoving && Math.random() < 0.2;
          const isMoving = isGreenMoving;
          platforms.push({
            ...platform, // kopiera grundegenskaper från platform
            x: fallbackX, // horisontell position
            y: platformY, // vertikal position
            w: this.platformWidth, // bredd
            h: this.platformHeight, // höjd
            disappearing: isDisappearing, // om plattformen ska försvinna
            moving: isMoving, // om plattformen ska röra sig
            isGreenMoving: isGreenMoving, // om det är en grön rörlig plattform
            originalX: fallbackX, // ursprunglig x-position för rörelse
            moveDirection: 1, // rörelseriktning (1 eller -1)
            moveSpeed: isMoving ? 1 + Math.random() * 2 : 0, // hastighet för rörelse
            moveRange: isMoving ? 40 + Math.random() * 80 : 0, // hur långt plattformen rör sig
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
              if (!this.moving) return; // bara om plattformen ska röra sig
              this.x += this.moveSpeed * this.moveDirection; // uppdatera x baserat på hastighet och riktning
              if (this.x > this.originalX + this.moveRange) {
                // om plattformen går för långt åt höger
                this.x = this.originalX + this.moveRange; // begränsa till max position
                this.moveDirection = -1; // byt riktning till vänster
              }
              if (this.x < this.originalX - this.moveRange) {
                // om plattformen går för långt åt vänster
                this.x = this.originalX - this.moveRange; // begränsa till min position
                this.moveDirection = 1; // byt riktning till höger
              }
            },
          });
          characterX = fallbackX;
        }

        currentY = platformY;
      }
    }

    this.lastPlatformY = currentY;
  },

  // Ta bort plattformar som ligger för långt ovanför kameran
  cleanPlatforms(platforms, cameraY) {
    return platforms.filter((p) => p.y > cameraY - 200);
  },
};
