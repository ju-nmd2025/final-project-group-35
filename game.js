import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import { gameOverScreen } from "./gameOverScreen.js";
import startScreen from "./startScreen.js";
import { platform } from "./platform.js";

// Game state
// Har spelet startat?
let gameStarted = false;
// Är spelet slut?
let gameOver = false;

// Var golvet är (som marken längst ner)
let floorY = 700;
// Lista med alla plattformar att hoppa på
let platforms;

// Poäng just nu
let score = 0;
// Bästa poängen vi någonsin fått
let maxScore = 0;

// Hjälper oss räkna poäng när vi går uppåt
let prevY = null;

// Starta om spelet: fixa gubben, gör plattformar och nollställ poäng
function restartGame(width) {
  character.init(floorY, width);
  platformGenerator.init(floorY - 100);
  platforms = platformGenerator.createInitialPlatforms(character, width);

  // Nollställ poängen
  score = 0;
  // Spara gubbens höjd för att räkna uppåt-poäng
  prevY = character.y;
  return platforms;
}

// Hämta golvets höjd
function getFloorY() {
  return floorY;
}

// Byt ut plattformarna mot en ny lista
function setPlatforms(newPlatforms) {
  platforms = newPlatforms;
}

// Hämta listan med plattformar
function getPlatforms() {
  return platforms;
}

// skapa canvas
function setup() {
  createCanvas(600, 800);
  floorY = getFloorY();
}

// ritar och uppdaterar spelet
function draw() {
  if (!gameStarted) {
    startScreen.draw(width, height);
  } else if (gameOver) {
    if (score > maxScore) {
      // Spara bästa poängen när spelet är slut
      maxScore = score;
    }

    // Visa Game Over-skärmen
    gameOverScreen.draw(width, height);
  } else {
    background(100, 100, 100);

    if (!Array.isArray(platforms)) platforms = [];

    character.draw(character.y);
    for (let p of platforms) {
      // Rita varje plattform och flytta den om den kan röra sig
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

    // Om gubben ramlar för långt ner och inte står på en plattform
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

// starta eller börja om spelet med musen
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

// Bara när spelet är igång ska vi flytta plattformar
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
  // Se till att det alltid finns fler plattformar ovanför att hoppa till
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

// Räkna poäng
function updateScore() {
  if (prevY === null) prevY = character.y;

  const deltaUp = Math.max(0, prevY - character.y);

  score += Math.floor(deltaUp);

  prevY = character.y;
}
