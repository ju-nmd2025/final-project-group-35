// gravitation och kollisioner mot plattformar
export let gravity = {
  // tyngdkraft och flyttar gubben vertikalt
  apply(character) {
    character.vy += character.gravity;
    character.y += character.vy;
  },
  // Studsa på plattformen
  handleFloorCollision(character, floorY) {
    if (character.y + character.h >= floorY) {
      character.y = floorY - character.h;
      character.vy = character.jumpStrength;
    }
  },
  handlePlatformCollision(character, platform) {
    // Gubben kan på plattformen endast om den faller nedåt
    if (
      character.x + character.w > platform.x && // gubben överlappar plattformen horisontellt från vänster
      character.x < platform.x + platform.w && // gubben överlappar plattformen horisontellt från höger
      character.vy > 0 && // gubben faller nedåt
      character.y + character.h >= platform.y && // gubbens botten är på eller under plattformens topp
      character.y + character.h - character.vy < platform.y // gubben var ovanför plattformen förra frame
    ) {
      // plattformen försvinner, ta bort och hoppa över studs
      if (platform.disappearing) {
        console.log("Platform disappeared!");
        platform.toRemove = true;

        return;
      }

      // Placera gubben ovanpå plattformen
      character.y = platform.y - character.h;
      character.vy = character.jumpStrength;
    }
  },
};
