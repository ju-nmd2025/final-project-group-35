class ScoreTracker {
  constructor() {
    this.score = 0;
    this.maxScore = 0;
    this.prevY = null;
  }

  reset(initialY) {
    this.score = 0;
    this.prevY = initialY;
  }

  update(currentY) {
    if (this.prevY === null) this.prevY = currentY;

    const deltaUp = Math.max(0, this.prevY - currentY);
    this.score += Math.floor(deltaUp);
    this.prevY = currentY;
  }

  updateMaxIfHigher() {
    if (this.score > this.maxScore) this.maxScore = this.score;
  }
}

export const scoreTracker = new ScoreTracker();
