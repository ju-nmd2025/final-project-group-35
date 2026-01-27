import Character from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import { gameOverScreen } from "./gameOverScreen.js";
import { startScreen } from "./startScreen.js";

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

window.setup = setup;

// ritar och uppdaterar spelet
function draw() {
  if (!gameStarted) {
    // Visa startskärmen med knappen om spelet inte har börjat
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

    // Se till att plattformar verkligen är en lista
    if (!Array.isArray(platforms)) platforms = [];

    // Rita gubben
    character.draw(character.y);
    for (let p of platforms) {
      // Rita varje plattform och flytta den om den kan röra sig
      p.draw(p.y);
      if (p.move) p.move();
    }

    // Låt gravitationen dra ner gubben och kolla landningar
    gravity.apply(character);
    for (let p of platforms) gravity.handlePlatformCollision(character, p);

    // Ta bort plattformar som ska försvinna
    platforms = platforms.filter((p) => !p.toRemove);

    // Kolla om gubben står på någon plattform just nu
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

    // Flytta gubben med piltangenter eller knappar
    movement.apply(character);

    // Flytta plattformarna, räkna poängen och rita poängen
    movePlatforms();
    updateScore();
    fill("black"); // färgen på texten
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

function movePlatforms() {
  // Bara när spelet är igång ska vi flytta plattformar
  if (
    !gameStarted ||
    gameOver ||
    !Array.isArray(platforms) ||
    platforms.length === 0
  )
    return;
  if (typeof width !== "number" || typeof height !== "number") return;

  // Om gubben är nära toppen flyttar vi plattformarna neråt
  const speed = character.y < 600 ? 9 : 0;
  platforms.forEach((p) => {
    p.y += speed;
  });

  // Om en plattform åker för långt ner, flytta upp den
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

  // Se till att det alltid finns fler plattformar ovanför att hoppa till
  // Om toppen är för långt ner, be generatorn skapa fler högre upp
  const generatorThreshold = character.y - 300;
  if (topY > generatorThreshold) {
    // Börja skapa nya plattformar från den nuvarande toppen
    platformGenerator.lastPlatformY = topY;
    platformGenerator.generatePlatforms(character.y, width, platforms);
    // Städa bort plattformar som är för långt bort
    platforms = platformGenerator.cleanPlatforms(platforms, 0);
  }
}

// Räkna poäng
function updateScore() {
  if (prevY === null) prevY = character.y; // första gången vi sparar höjden

  const deltaUp = Math.max(0, prevY - character.y); // hur mycket vi gått upp

  score += Math.floor(deltaUp); // lägg till poäng

  prevY = character.y; // spara höjden till nästa gång
}

window.draw = draw;

window.addEventListener("keydown", function (event) {
  keyIsDown();
});
