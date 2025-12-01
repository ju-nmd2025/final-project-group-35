import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import { gameOverScreen } from "./gameOverScreen.js";
import startScreen from "./startScreen.js";

// Game state
let gameStarted = false;
let gameOver = false;

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
}

function draw() {
  if (!gameStarted) {
    startScreen.draw(width, height);
  } else if (gameOver) {
    gameOverScreen.draw(width, height);
  } else {
    background(100, 100, 100);

    if (!Array.isArray(platforms)) platforms = [];

    character.draw(character.y);
    for (let p of platforms) {
      p.draw(p.y);
      if (p.move) p.move();
    }

    gravity.apply(character);
    for (let p of platforms) gravity.handlePlatformCollision(character, p);

    let onPlatform = false;
    for (let p of platforms) {
      if (
        character.x + character.w > p.x &&
        character.x < p.x + p.w &&
        character.y + character.h >= p.y - 5 &&
        character.y + character.h <= p.y + p.h + 5
      ) {
        onPlatform = true;
        break;
      }
    }

    if (character.y + character.h > floorY + 5 && !onPlatform) {
      console.log("Game Over! Character fell off!");
      gameOver = true;
    }

    movement.apply(character);

    platformGenerator.generatePlatforms(character.y, width, platforms);
    platforms = platformGenerator.cleanPlatforms(platforms, 0);
  }
}

function mouseClicked() {
  if (!gameStarted) {
    if (startScreen.isButtonClicked(mouseX, mouseY)) {
      console.log("Start button clicked! Starting game...");
      gameStarted = true;
      gameOver = false;
      platforms = restartGame(width);
    }
  } else if (gameOver) {
    if (gameOverScreen.isButtonClicked(mouseX, mouseY)) {
      console.log("Restart button clicked! Returning to start screen...");
      gameStarted = false;
      gameOver = false;
    }
  }
}
