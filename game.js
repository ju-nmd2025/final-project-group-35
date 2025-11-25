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
    // Draw start screen
    startScreen.draw(width, height);
  } else if (gameOver) {
    // Draw game over screen
    gameOverScreen.draw(width, height);
  } else {
    // Draw game
    background(100, 100, 100);

    if (!Array.isArray(platforms)) platforms = [];

    character.draw(character.y);
    for (let p of platforms) {
      p.draw(p.y);
      if (p.move) p.move();
    }

    gravity.apply(character);

    // Handle platform collisions FIRST
    for (let p of platforms) gravity.handlePlatformCollision(character, p);

    // THEN check if character is on a platform
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

    // Game over if character passes floor level AND is not on a platform
    if (character.y + character.h > floorY + 5 && !onPlatform) {
      console.log("Game Over! Character fell off!");
      gameOver = true;
      return; // Stop the game loop
    }

    movement.apply(character);

    platformGenerator.generatePlatforms(character.y, width, platforms);
    platforms = platformGenerator.cleanPlatforms(platforms, 0);
  }
}

function mouseClicked() {
  if (!gameStarted) {
    // Start screen - check if start button was clicked
    if (startScreen.isButtonClicked(mouseX, mouseY)) {
      console.log("Start button clicked! Starting game...");
      gameStarted = true;
      gameOver = false;
      // Initialize the game
      platforms = restartGame(width);
    }
  } else if (gameOver) {
    // Game over screen - check if restart button was clicked
    if (gameOverScreen.isButtonClicked(mouseX, mouseY)) {
      console.log("Restart button clicked! Returning to start screen...");
      gameStarted = false;
      gameOver = false;
      // Don't initialize game yet - wait for start screen
    }
  }
}
