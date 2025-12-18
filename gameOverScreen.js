export default class gameOverScreen {
  buttonX: 200,
  buttonY: 370,
  buttonW: 200,
  buttonH: 60,

  draw(width, height) {
    // Draw game over screen
    background(200, 50, 50);

    // Draw game over text
    textSize(48);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 60);

    fill(255);
    textSize(24);
    text(`score:${score}`,width / 2, height / 2 -100);
    text(`max score:${maxScore}`,width / 2, height / 2 );
    // Draw restart button
    fill(255);
    rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH);

    // Draw button text
    textSize(32);
    fill(0);
    text(
      "Restart",
      this.buttonX + this.buttonW / 2,
      this.buttonY + this.buttonH / 2
    );
  }

  isButtonClicked(mouseX, mouseY) {
    return (
      mouseX > this.buttonX &&
      mouseX < this.buttonX + this.buttonW &&
      mouseY > this.buttonY &&
      mouseY < this.buttonY + this.buttonH
    );
  }
}

export { gameOverScreen };