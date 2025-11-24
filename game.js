import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import {
  restartGame,
  getFloorY,
  getPlatforms,
  setPlatforms,
} from "./gameManager.js";

let platforms;
let floorY;

function setup() {
  createCanvas(600, 800);
  floorY = getFloorY();
  platforms = restartGame(width);
}

// Game restart logic is now in gameManager.js

function draw() {
  background(100, 100, 100);

  // Camera logic removed
  character.draw(character.y);
  for (const p of platforms) {
    p.draw(p.y);
    if (p.move) p.move();
  }

  gravity.apply(character);
  gravity.handleFloorCollision(character, floorY);
  for (const p of platforms) gravity.handlePlatformCollision(character, p);

  movement.apply(character);

  line(0, 700, 600, 700);

  platformGenerator.generatePlatforms(character.y, width, platforms);
  platforms = platformGenerator.cleanPlatforms(platforms, 0);
  setPlatforms(platforms);
}

function keyPressed() {
  if (key === "r") {
    platforms = restartGame(width);
    setPlatforms(platforms);
  }
  if (key === " " && character.y + character.h >= floorY) {
    character.vy = character.jumpStrength;
  }
}
