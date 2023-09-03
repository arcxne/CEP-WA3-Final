let circles = [];
let circlesNum = 0;
let inputs = [];
let walls;
let play = false;
let elasticity = 90; // Elastic collision
let grabRadius = 40;
let grabbing = false;
let globalGrabDir = false;
let simSpeed = 1;
let lastTime = 0;
let deltaTime = 0;

let font;

let particles = [];

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (!particles[i].isAlive()) {
      particles.splice(i, 1); // Remove dead particles
    }
  }
}

function displayParticles() {
  for (let particle of particles) {
    particle.display();
  }
}


function preload() {
  // import sharetechmono font
  font = loadFont('assets/ShareTechMono-Regular.ttf');
}

function setup() {
  walls = [15, 15, 585, windowHeight-15];

  createCanvas(walls[2]+15, windowHeight);
 
  circles.push(
    new Circle(
      50,
      walls[3] * 0.5 + 50,
      5,
      2,
      1
    )
  );

  circles.push(
    new Circle(
      walls[2] - 50,
      walls[3] * 0.5,
      -2,
      4,
      3
    )
  );

  circles.push(
    new Circle(
      walls[2] * 0.5,
      walls[3] * 0.5 - 50,
      0,
      10,
      5
    )
  );

  circles.forEach((circle) => {
    UIEvents.updateDataPanel(circle);
  });

  lastTime = performance.now();
  requestAnimationFrame(updateAnimation);
  circlesNum = circles.length;

  textFont(font);
}

function draw() { }  // * Not using draw()

function updateAnimation(currentTime) {
  createCanvas(walls[2]+15, windowHeight);
  walls[3] = windowHeight-15;

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    background('#ECECED');
  } else {
    background('#121212');
  }

  deltaTime = (currentTime - lastTime) / 10;
  lastTime = currentTime;

  // Call the updateAnimation function again on the next frame
  requestAnimationFrame(updateAnimation);

  let outputSimSpeedParagraph = document.getElementById("outputSimSpeed");
  outputSimSpeedParagraph.textContent = 'Simulation Speed (x' + simSpeed + ')';

  let outputElasticityParagraph = document.getElementById("outputElasticity");
  outputElasticityParagraph.textContent = 'Elasticity Value (' + elasticity + '%)';

  display();
}

function display() {

  userIntf();

  updateParticles(); // Update particles
  displayParticles(); // Display particles
  UIEvents.updateDataPage(); // Update circles

  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();
    circles[i].displayLabels();
    // UIEvents.updateCircleData(i, inputs[i]);
    if (play) {
      for (let j = i + 1; j < circles.length; j++) {
        if (circles[i].checkCollision(circles[j])) {
          circles[i].handleCollision(circles[j]);
        }
      }
      circles[i].updatePosition();
    } else {
      circles[i].grabChange();
    }
  }
}

function userIntf() {
  // Collision container
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    fill('#FFFFFF');
  } else {
    fill('#1e2329');
  }
  rect(walls[0], walls[1], walls[2] - walls[0], walls[3] - walls[1], 15);
}

// Mouse events
function mousePressed() {
  grabbing = true;
}

function mouseReleased() {
  grabbing = false;
  globalGrabDir = false;
}
