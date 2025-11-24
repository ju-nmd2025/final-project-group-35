export let character = {
  x: 260,
  y: 250,
  w: 80,
  h: 75,
  vy: 0,
  gravity: 0.6,
  onGround: false,

  init(floorY, width) {
    this.x = width / 2;
    this.y = floorY - this.h;
    this.vy = 0;
    this.gravity = 0.6;
    this.jumpStrength = -20;
    this.maxVy = 15;
  },

  draw() {
    fill(200, 180, 0);
    strokeWeight(1);
    rect(this.x, this.y, 600 / 8, 600 / 8, 10);

    fill(255);
    circle(this.x + 150 / 8, this.y + 150 / 8, 100 / 8);
    circle(this.x + 450 / 8, this.y + 150 / 8, 100 / 8);
    arc(this.x + 300 / 8, this.y + 250 / 8, 290 / 8, 280 / 8, 0, PI, PIE);

    fill(0);
    circle(this.x + 160 / 8, this.y + 140 / 8, 20 / 8);
    circle(this.x + 460 / 8, this.y + 140 / 8, 20 / 8);
  },
};
