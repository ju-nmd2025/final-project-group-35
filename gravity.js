export let gravity = {
  apply(character) {
    character.vy += character.gravity;
    character.y += character.vy;
  },
  handleFloorCollision(character, floorY) {
    if (character.y + character.h >= floorY) {
      character.y = floorY - character.h;
      character.vy = character.jumpStrength;
    }
  },
  handlePlatformCollision(character, platform) {
    // Only check downward collision (landing on top of platform)
    // Character can pass through platforms from below and from the sides
    if (
      character.x + character.w > platform.x &&
      character.x < platform.x + platform.w &&
      character.vy > 0 &&
      character.y + character.h >= platform.y &&
      character.y + character.h - character.vy < platform.y
    ) {
      character.y = platform.y - character.h;
      character.vy = character.jumpStrength;
    }
  },
};
