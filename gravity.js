<<<<<<< Updated upstream
export default class Gravity {
  apply(character) {
    character.vy += character.gravity;
    character.y += character.vy;
  }
=======
// gravitation och kollisioner mot plattformar
export let gravity = {
  // tyngdkraft och flyttar gubben vertikalt
  apply(character) {
    character.vy += character.gravity;
    character.y += character.vy;
  },
  // Studsa på plattformen
>>>>>>> Stashed changes
  handleFloorCollision(character, floorY) {
    if (character.y + character.h >= floorY) {
      character.y = floorY - character.h;
      character.vy = character.jumpStrength;
    }
<<<<<<< Updated upstream
  }
=======
  },
  // Landning på plattform uppifrån
>>>>>>> Stashed changes
  handlePlatformCollision(character, platform) {
    if (
      character.x + character.w > platform.x &&
      character.x < platform.x + platform.w &&
      character.vy > 0 &&
      character.y + character.h >= platform.y &&
      character.y + character.h - character.vy < platform.y
    ) {
<<<<<<< Updated upstream
=======
      // plattformen försvinner, ta bort och hoppa över studs
>>>>>>> Stashed changes
      if (platform.disappearing) {
        console.log("Platform disappeared!");
        platform.toRemove = true;

        return;
      }

<<<<<<< Updated upstream
=======
      // Placera gubben ovanpå plattformen
>>>>>>> Stashed changes
      character.y = platform.y - character.h;
      character.vy = character.jumpStrength;
    }
  }
}

export { Gravity };
