import { character } from "./character.js";
import { platformGenerator } from "./platformGenerator.js";

let floorY = 700;
let platforms;

export function restartGame(width) {
  character.init(floorY, width);
  platformGenerator.init(floorY - 100);
  platforms = platformGenerator.createInitialPlatforms(character, width);
  return platforms;
}

export function getFloorY() {
  return floorY;
}

export function setPlatforms(newPlatforms) {
  platforms = newPlatforms;
}

export function getPlatforms() {
  return platforms;
}
