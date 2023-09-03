class Particle {
  constructor(x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.alpha = 255; // Initial opacity
    this.size = 5; // Particle size
    this.color = color(255, 0, 0); // Particle color (red in this example)
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 5; // Reduce opacity over time
  }

  isAlive() {
    return this.alpha > 0;
  }

  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}
