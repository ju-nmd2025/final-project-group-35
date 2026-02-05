import { scoreTracker } from "./scoreTracker.js";

export let gameOverScreen = {
  buttonX: 200,
  buttonY: 370,
  buttonW: 200,
  buttonH: 60,

  draw(width, height) {
    // Bakgrund och rubrik
    background(200, 50, 50);

    // Game Over-text
    textSize(48);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 60);

    fill(255);
    textSize(24);
    text("score: " + scoreTracker.score, width / 2, height / 2 - 100);
    text("max score: " + scoreTracker.maxScore, width / 2, height / 2);
    // Rita restart knappen
    fill(255);
    rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH);

    // Text på knappen
    textSize(32);
    fill(0);
    text(
      "Restart",
      this.buttonX + this.buttonW / 2,
      this.buttonY + this.buttonH / 2,
    );
  },

  // om klickade på restart-knappen
  isButtonClicked(mouseX, mouseY) {
    return (
      mouseX > this.buttonX &&
      mouseX < this.buttonX + this.buttonW &&
      mouseY > this.buttonY &&
      mouseY < this.buttonY + this.buttonH
    );
  },
};
