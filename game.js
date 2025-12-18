import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import { gameOverScreen } from "./gameOverScreen.js";
import { startScreen } from "./startScreen.js";

// Game state
let gameStarted = false;
let gameOver = false;

let floorY = 700;
let platforms;

let score = 0;
let maxScore = 0;

let prevY = null;

function restartGame(width) {
  character.init(floorY, width);
  platformGenerator.init(floorY - 100);
  platforms = platformGenerator.createInitialPlatforms(character, width);

  score = 0;
  prevY = character.y;
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
    if (score > maxScore) {
      maxScore = score;
    }

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

    platforms = platforms.filter((p) => !p.toRemove);

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

    if (character.y + character.h > height + 5 && !onPlatform) {
      console.log("Game Over! Character fell off!");
      gameOver = true;
    }

    movement.apply(character);

    movePlatforms();
    updateScore();
    fill("black");
    textSize(24);
    text(score, 30, 20);
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

function movePlatforms() {
  // only run while the game is active
  if (
    !gameStarted ||
    gameOver ||
    !Array.isArray(platforms) ||
    platforms.length === 0
  )
    return;
  if (typeof width !== "number" || typeof height !== "number") return;

  const speed = character.y < 600 ? 9 : 0; // move platforms down only when character is near top
  platforms.forEach((p) => {
    p.y += speed;
  });

  // recycle platforms that moved off the bottom by moving them above the highest platform
  const topY = Math.min(...platforms.map((p) => p.y));
  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];
    if (p.y > height && p.y !== 700) {
      const minSpawnY = Math.max(-200, topY - 150);
      const maxSpawnY = topY - 90;
      p.y = minSpawnY + Math.random() * (maxSpawnY - minSpawnY);
      p.x =
        Math.random() *
        Math.max(0, width - (p.w || platformGenerator.platformWidth));

      if (p.moving) {
        p.originalX = p.x;
        p.moveDirection = Math.random() < 0.5 ? 1 : -1;
      }
    }
  }

  // ensure there are always platforms generated above the current top
  // if the highest platform is below the generator threshold, tell the generator to extend upward
  const generatorThreshold = character.y - 300;
  if (topY > generatorThreshold) {
    // make the generator start from the current top and add more above it
    platformGenerator.lastPlatformY = topY;
    platformGenerator.generatePlatforms(character.y, width, platforms);
    // optionally trim any far-away platforms
    platforms = platformGenerator.cleanPlatforms(platforms, 0);
  }
}

function updateScore() {
  if (prevY === null) prevY = character.y;

  const deltaUp = Math.max(0, prevY - character.y);

  score += Math.floor(deltaUp);

  prevY = character.y;
}

window.setup = setup;

window.draw = draw;

window.addEventListener("keydown", function (event) {
  keyIsDown();
});
