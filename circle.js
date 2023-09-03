class Circle {
  constructor(x, y, velx, vely, mass) {
    this.x = x;
    this.y = y;
    this.radius = this.calcSize(mass);
    this.velx = velx;
    this.vely = vely;
    this.ke = 0.5 * mass * (velx ** 2 + vely ** 2);
    this.momentum = mass * sqrt(velx ** 2 + vely ** 2);
    this.mass = mass;
    this.colour = color(255 - mass * 20, 255 - mass * 20, mass * 20);
    this.grabObj = false;
    this.grabDir = false;

    this.lenX = 0;
    this.lenY = 0;
  }

  updatePosition() {
    this.bounceOffWalls();
    this.x += this.velx * (simSpeed * deltaTime) * 0.25;
    this.y += this.vely * (simSpeed * deltaTime) * 0.25;
  }

  bounceOffWalls() {
    let e2 = (1 + elasticity * 0.01) * 0.5;
    if (this.x - this.radius - 1 < walls[0]) {
      this.x = walls[0] + this.radius + 1;
      this.velx *= -e2;
    }
    if (this.x + this.radius + 1 > walls[2]) {
      this.x = walls[2] - this.radius - 1;
      this.velx *= -e2;
    }

    if (this.y - this.radius - 1 < walls[1]) {
      this.y = walls[1] + this.radius + 1;
      this.vely *= -e2;
    }
    if (this.y + this.radius + 1 > walls[3]) {
      this.y = walls[3] - this.radius - 1;
      this.vely *= -e2;
    }
  }

  calcSize(mass) {
    return mass * 6 + 15;
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
    let v1 = createVector(this.velx, this.vely);
    let v2 = createVector(otherCircle.velx, otherCircle.vely);
    let rotatedV1 = this.rotateVector(v1, -angle);
    let rotatedV2 = this.rotateVector(v2, -angle);
    let finalV1 = this.calculateFinalVelocity(rotatedV1, rotatedV2, this.mass, otherCircle.mass);
    let finalV2 = this.calculateFinalVelocity(rotatedV2, rotatedV1, otherCircle.mass, this.mass);
    let newV1 = this.rotateVector(finalV1, angle);
    let newV2 = this.rotateVector(finalV2, angle);
    this.velx = newV1.x;
    this.vely = newV1.y;
    otherCircle.velx = newV2.x;
    otherCircle.vely = newV2.y;

    let overlap = this.radius + otherCircle.radius - dist(this.x, this.y, otherCircle.x, otherCircle.y);
    let dx = this.x - otherCircle.x;
    let dy = this.y - otherCircle.y;
    let direction = createVector(dx, dy).normalize();
    this.x += direction.x * overlap * 0.5;
    this.y += direction.y * overlap * 0.5;
    otherCircle.x -= direction.x * overlap * 0.5;
    otherCircle.y -= direction.y * overlap * 0.5;

    let collisionX = (this.x + otherCircle.x) / 2;
    let collisionY = (this.y + otherCircle.y) / 2;

    for (let i = 0; i < 10; i++) {
      let angle = random(TWO_PI);
      let speed = random(1, 5);
      let particle = new Particle(collisionX, collisionY, cos(angle) * speed, sin(angle) * speed);
      particles.push(particle);
    }
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
        this.velx = (this.lenX - this.x) / 15;
        this.vely = (this.lenY - this.y) / 15;
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
    this.lenX = this.x + this.velx * 15;
    this.lenY = this.y + this.vely * 15;

    fill(255, 0, 0, 50);
    ellipse(this.lenX, this.lenY, grabRadius);

    strokeWeight(3);
    stroke(0);
    line(this.x, this.y, this.lenX, this.lenY);
    
    // * text on simulation tends to be distracting
    // textAlign(CENTER);
    // fill(0);
    // text(round(sqrt(this.velx ** 2 + this.vely ** 2), 2), this.x, this.y + this.radius + 15);
  }

  draw() {
    this.ke = 0.5 * this.mass * (this.velx ** 2 + this.vely ** 2);
    this.momentum = this.mass * sqrt(this.velx ** 2 + this.vely ** 2);
    this.radius = this.calcSize(this.mass);
    this.colour = color(255 - this.mass * 20, 255 - this.mass * 20, this.mass * 20);

    fill(this.colour);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}
