export default class Movement {
  apply(character) {
    if (keyIsDown(LEFT_ARROW)) {
      character.x -= 10;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      character.x += 10;
    }
    // Wrap around screen
    if (character.x + character.w < 0) {
      character.x = 600;
    }
    if (character.x > 600) {
      character.x = -character.w;
    }
  }
}

export { Movement };
