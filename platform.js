<<<<<<< Updated upstream
export default class Platform {
  x = 20;
  y = 50;
  w = 80;
  h = 20;
  vx = 2;
=======
// Grunddata för en plattform och hur den ritas
export let platform = {
  x: 20,
  y: 50,
  w: 80,
  h: 20,
  vx: 2,

  
>>>>>>> Stashed changes

  // Ritar plattformen som en enkel rektangel
  draw() {
    push();
    fill("blue");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}

export { Platform };
