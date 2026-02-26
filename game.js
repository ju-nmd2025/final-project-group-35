import { character } from "./character.js";
import { gravity } from "./gravity.js";
import { movement } from "./movement.js";
import { platformGenerator } from "./platformGenerator.js";
import { gameOverScreen } from "./gameOverScreen.js";
import { startScreen } from "./startScreen.js";
import { scoreTracker } from "./scoreTracker.js";

window.setup = setup;

window.draw = draw;

class GameState {
    constructor() {
        // Håller reda på om spelet är igång eller slut
        this.started = false;
        this.over = false;
    }

    start() {
        this.started = true;
        this.over = false;
    }

    end() {
        this.over = true;
    }

    reset() {
        this.started = false;
        this.over = false;
    }
}

const gameState = new GameState();

class CollisionChecker {
    isOnPlatform(character, platformList) {
        // Kollar om gubben står på någon plattform
        for (let p of platformList) {
            if (
                character.x + character.w > p.x &&
                character.x < p.x + p.w &&
                character.y + character.h >= p.y - 5 &&
                character.y + character.h <= p.y + p.h + 5
            ) {
                return true;
            }
        }

        return false;
    }

    fellOff(character, sceneHeight, onPlatform) {
        // Kollar om gubben har ramlat under skärmen
        return character.y + character.h > sceneHeight + 5 && !onPlatform;
    }
}

const collisionChecker = new CollisionChecker();

// Var golvet är (som marken längst ner)
let floorY = 700;
// Lista med alla plattformar att hoppa på
let platforms;

// Starta om spelet: fixa gubben, gör plattformar och nollställ poäng
function restartGame(width) {
    character.init(floorY, width);
    platformGenerator.init(floorY - 100);
    platforms = platformGenerator.createInitialPlatforms(character, width);

    // Nollställ poängen
    scoreTracker.reset(character.y);
    return platforms;
}

// skapa canvas
function setup() {
    createCanvas(600, 800);
    floorY = 700;
}

// ritar och uppdaterar spelet
function draw() {
    if (!gameState.started) {
        startScreen.draw(width, height);
    } else if (gameState.over) {
        // Spara bästa poängen när spelet är slut
        scoreTracker.updateMaxIfHigher();

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

        const onPlatform = collisionChecker.isOnPlatform(character, platforms);

        // Om gubben ramlar för långt ner och inte står på en plattform
        if (collisionChecker.fellOff(character, height, onPlatform)) {
            console.log("Game Over! Character fell off!");
            gameState.end();
        }

        movement.apply(character);

        movePlatforms();
        updateScore();
        fill("black");
        textSize(24);
        text(scoreTracker.score, 30, 20);
    }
}

// starta eller börja om spelet med musen
function mouseClicked() {
    if (!gameState.started) {
        if (startScreen.isButtonClicked(mouseX, mouseY)) {
            console.log("Start button clicked! Starting game...");
            gameState.start();
            platforms = restartGame(width);
        }
    } else if (gameState.over) {
        if (gameOverScreen.isButtonClicked(mouseX, mouseY)) {
            console.log("Restart button clicked! Returning to start screen...");
            gameState.reset();
        }
    }
}

// Bara när spelet är igång ska vi flytta plattformar
function movePlatforms() {
    if (
        !gameState.started ||
        gameState.over ||
        !Array.isArray(platforms) ||
        platforms.length === 0
    )
        return;
    if (typeof width !== "number" || typeof height !== "number") return;

    const speed = character.y < 600 ? 9 : 0; // flytta plattformar nedåt endast när gubben är nära toppen
    platforms.forEach((p) => {
        p.y += speed;
    });

    // återanvänd plattformar som har flyttat sig utanför botten genom att flytta dem ovanför den högsta plattformen
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
    const generatorThreshold = character.y - 300;
    if (topY > generatorThreshold) {
        // Skapa fler plattformar ovanför
        platformGenerator.lastPlatformY = topY;
        platformGenerator.generatePlatforms(character.y, width, platforms);
        // Trimma listan med plattformar för att ta bort onödiga
        platforms = platformGenerator.cleanPlatforms(platforms, 0);
    }
}

// Räkna poäng
function updateScore() {
    scoreTracker.update(character.y);
}

// All your other code is above!
window.setup = setup;

window.draw = draw;

window.addEventListener("click", function (event) {
    mouseClicked();
});

window.addEventListener("keydown", function (event) {
    movement.apply(character);
});
