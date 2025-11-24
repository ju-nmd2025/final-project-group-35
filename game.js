import character from "./character.js";
import platform from "./platform.js";
import gravity from "./gravity.js";
import movement from "./movement.js";
import { camera } from "./camera.js";

const floorY = 700;

character.gravity = 0.6;
character.vy = 0;
character.jumpStrength = -20;
character.maxVy = 15;

function setup() {
  createCanvas(600, 800);
}

function draw() {
  background(100, 100, 100);

  camera.follow(character, height);

  character.draw(camera.apply(character.y));
  platform.draw(camera.apply(platform.y));

  platform.y -= +1;
  if (platform.y + platform.h < 150) {
    platform.y = 500;
  }

  gravity.apply(character);
  gravity.handleFloorCollision(character, floorY);
  gravity.handlePlatformCollision(character, platform);

  movement.apply(character);

  line(0, camera.apply(700), 600, camera.apply(700));
}

function keyPressed() {
  if (key === " " && character.y + character.h >= floorY) {
    character.vy = character.jumpStrength;
  }
}
