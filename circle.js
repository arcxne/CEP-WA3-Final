class Circle {
  constructor(x, y, speedX, speedY, mass, colour) {
    this.x = x;
    this.y = y;
    this.radius = mass*6+15;
    this.speedX = speedX;
    this.speedY = speedY;
    this.mass = mass;
    this.colour = colour;
    this.grabObj = false;
    this.grabDir = false;

    this.lenX = 0;
    this.lenY = 0;
  }

  updatePosition() {
    this.bounceOffWalls();
    this.x += this.speedX * (simSpeed * deltaTime) * 0.5;
    this.y += this.speedY * (simSpeed * deltaTime) * 0.5;
  }

  bounceOffWalls() {
    let e2 = (1 + elasticity * 0.01) * 0.5;
    if (this.x - this.radius - 1 < walls[0]) {
      this.x = walls[0] + this.radius + 1;
      this.speedX *= -e2;
    }
    if (this.x + this.radius + 1 > walls[2]) {
      this.x = walls[2] - this.radius - 1;
      this.speedX *= -e2;
    }

    if (this.y - this.radius - 1 < walls[1]) {
      this.y = walls[1] + this.radius + 1;
      this.speedY *= -e2;
    }
    if (this.y + this.radius + 1 > walls[3]) {
      this.y = walls[3] - this.radius - 1;
      this.speedY *= -e2;
    }
  }

  checkCollision(otherCircle) {
    let distance = dist(this.x, this.y, otherCircle.x, otherCircle.y);
    if (distance < this.radius + otherCircle.radius) {
      return true; // Collision detected
    } else {
      return false; // No collision
    }
  }

  handleCollision(otherCircle) {
    let angle = atan2(otherCircle.y - this.y, otherCircle.x - this.x);
    let v1 = createVector(this.speedX, this.speedY);
    let v2 = createVector(otherCircle.speedX, otherCircle.speedY);
    let rotatedV1 = this.rotateVector(v1, -angle);
    let rotatedV2 = this.rotateVector(v2, -angle);
    let finalV1 = this.calculateFinalVelocity(rotatedV1, rotatedV2, this.mass, otherCircle.mass);
    let finalV2 = this.calculateFinalVelocity(rotatedV2, rotatedV1, otherCircle.mass, this.mass);
    let newV1 = this.rotateVector(finalV1, angle);
    let newV2 = this.rotateVector(finalV2, angle);
    this.speedX = newV1.x;
    this.speedY = newV1.y;
    otherCircle.speedX = newV2.x;
    otherCircle.speedY = newV2.y;

    let overlap = this.radius + otherCircle.radius - dist(this.x, this.y, otherCircle.x, otherCircle.y);
    let dx = this.x - otherCircle.x;
    let dy = this.y - otherCircle.y;
    let direction = createVector(dx, dy).normalize();
    this.x += direction.x * overlap * 0.5;
    this.y += direction.y * overlap * 0.5;
    otherCircle.x -= direction.x * overlap * 0.5;
    otherCircle.y -= direction.y * overlap * 0.5;
  }

  rotateVector(vector, angle) {
    let x = vector.x * cos(angle) - vector.y * sin(angle);
    let y = vector.x * sin(angle) + vector.y * cos(angle);
    return createVector(x, y);
  }

  calculateFinalVelocity(v1, v2, m1, m2) {
    let e = elasticity * 0.01;
    let x1 = ((m1 - m2) * v1.x + (1 + e) * m2 * v2.x) / (m1 + m2);
    let y1 = v1.y;
    return createVector(x1, y1);
  }

  grabChange() {
    if (grabbing) {
      let dDir = dist(this.lenX, this.lenY, mouseX, mouseY);
      if (dDir < grabRadius * 0.5) {
        this.grabDir = true;
        globalGrabDir = true;
      }
      if (this.grabDir) {
        this.lenX = mouseX;
        this.lenY = mouseY;
        this.speedX = (this.lenX - this.x) / 15;
        this.speedY = (this.lenY - this.y) / 15;
      }

      let dObj = dist(this.x, this.y, mouseX, mouseY);
      if (dObj < this.radius && !globalGrabDir) {
        this.grabObj = true;
      }
      if (this.grabObj) {
        this.x = mouseX;
        this.y = mouseY;
      }
    } else {
      this.grabObj = false;
      this.grabDir = false;
    }
  }

  displayLabels() {
    this.lenX = this.x + this.speedX * 15;
    this.lenY = this.y + this.speedY * 15;

    textAlign(CENTER);
    fill(0);
    text(round(sqrt(this.speedX**2+this.speedY**2), 2), this.x, this.y + this.radius + 15);

    fill(255, 0, 0, 50);
    ellipse(this.lenX, this.lenY, grabRadius);
    
    strokeWeight(3);
    stroke(0);
    line(this.x, this.y, this.lenX, this.lenY);
  }

  draw() {
    fill(this.colour);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}
