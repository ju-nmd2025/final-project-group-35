export let platform = {
  x: 20,
  y: 50,
  w: 80,
  h: 20,

  draw() {
    push();
    fill("blue");
    rect(this.x, this.y, this.w, this.h);
    pop();
  },
};

