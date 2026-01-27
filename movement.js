// Hanterar tangenttryckningar
export let movement = {
  apply(character) {
    if (keyIsDown(LEFT_ARROW)) {
      character.x -= 10;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      character.x += 10;
    }
    // Gå ut till vänster → kom in från höger
    if (character.x + character.w < 0) {
      character.x = 600;
    }
    // Gå ut till höger → kom in från vänster
    if (character.x > 600) {
      character.x = -character.w;
    }
  },
};
