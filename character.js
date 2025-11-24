export let character = {
  draw() {
    fill(200, 180, 0);
    strokeWeight(1);
    rect(100 / 8, 100 / 8, 600 / 8, 600 / 8, 10);
    arc(100 / 8, 100 / 8, 150 / 8, 150 / 8, HALF_PI, 2 * PI, OPEN);
    arc(700 / 8, 100 / 8, 150 / 8, 150 / 8, PI, HALF_PI, OPEN);

    fill(255);
    circle(250 / 8, 250 / 8, 100 / 8);
    circle(550 / 8, 250 / 8, 100 / 8);
    arc(400 / 8, 450 / 8, 290 / 8, 280 / 8, 0, PI, PIE);

    fill(0);
    circle(260 / 8, 240 / 8, 20 / 8);
    circle(560 / 8, 240 / 8, 20 / 8);
  },
};
