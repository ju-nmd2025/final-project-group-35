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
    // Downward collision (feet on platform)
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
    // Upward collision (head hits platform bottom)
    if (
      character.x + character.w > platform.x &&
      character.x < platform.x + platform.w &&
      character.vy < 0 &&
      character.y <= platform.y + platform.h &&
      character.y - character.vy > platform.y + platform.h
    ) {
      character.y = platform.y + platform.h;
      character.vy = 0;
    }
    // Side collision (prevent moving through platform sides)
    if (
      character.y + character.h > platform.y &&
      character.y < platform.y + platform.h
    ) {
      // Collided with left side
      if (
        character.x < platform.x + platform.w &&
        character.x + character.w > platform.x &&
        character.x < platform.x
      ) {
        character.x = platform.x - character.w;
      }
      // Collided with right side
      if (
        character.x < platform.x + platform.w &&
        character.x + character.w > platform.x &&
        character.x > platform.x
      ) {
        character.x = platform.x + platform.w;
      }
    }
  },
};
