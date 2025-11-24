import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";

let floorY = 700;
let platforms;

function restartGame(width) {
  character.init(floorY, width);
  platformGenerator.init(floorY - 100);
  platforms = platformGenerator.createInitialPlatforms(character, width);
  return platforms;
}

function getFloorY() {
  return floorY;
}

function setPlatforms(newPlatforms) {
  platforms = newPlatforms;
}

function getPlatforms() {
  return platforms;
}

function setup() {
  createCanvas(600, 800);
  floorY = getFloorY();
  platforms = restartGame(width);
}

function draw() {
  background(100, 100, 100);

  if (!Array.isArray(platforms)) platforms = [];

  character.draw(character.y);
  for (const p of platforms) {
    p.draw(p.y);
    if (p.move) p.move();
  }

  gravity.apply(character);
  gravity.handleFloorCollision(character, floorY);
  for (const p of platforms) gravity.handlePlatformCollision(character, p);

  movement.apply(character);

  platformGenerator.generatePlatforms(character.y, width, platforms);
  platforms = platformGenerator.cleanPlatforms(platforms, 0);
}
