export let startScreen = {
  buttonX: 200,
  buttonY: 370,
  buttonW: 200,
  buttonH: 60,

  draw: function (width, height) {
    background(0, 150, 200);

    // Draw title
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("Not so doodle jump", width / 2, 200);

    // Draw start button
    fill(100, 200, 100);
    rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH, 10);

    // Draw button text
    fill(255);
    textSize(32);
    text(
      "Start",
      this.buttonX + this.buttonW / 2,
      this.buttonY + this.buttonH / 2
    );
  },

  isButtonClicked: function (mouseX, mouseY) {
    return (
      mouseX > this.buttonX &&
      mouseX < this.buttonX + this.buttonW &&
      mouseY > this.buttonY &&
      mouseY < this.buttonY + this.buttonH
    );
  },
};

export { startScreen };