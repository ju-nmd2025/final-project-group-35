export let camera = {
  y: 0,
  follow(target, canvasHeight) {
    // Smoothly follow character upwards if above y=0
    let targetY = target.y - canvasHeight / 2;
    if (targetY < this.y) {
      // Use linear interpolation for smooth movement
      this.y = lerp(this.y, targetY, 0, 0.05);
    }
  },
  apply(y) {
    // Returns the screen y position for a world y
    return y - this.y;
  },
};
