// Description: Main file for the collision simulation

// * Global variables

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

// * Functions

// Particle system
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
  // Set up the canvas
  walls = [15, 15, 585, windowHeight-15];
  createCanvas(walls[2]+15, windowHeight);
 
  // Create the circles
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

  // Create the data panels
  circles.forEach((circle) => {
    UIEvents.updateDataPanel(circle);
  });

  // Set up the animation
  lastTime = performance.now();
  requestAnimationFrame(updateAnimation);
  circlesNum = circles.length;
}

function draw() { }  // Not using draw()

// Animation loop
function updateAnimation(currentTime) {
  // Set up the canvas
  createCanvas(walls[2]+15, windowHeight);
  walls[3] = windowHeight-15;

  // Match background to system theme
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    background('#ECECED');
  } else {
    background('#121212');
  }

  // Update the simulation speed
  deltaTime = (currentTime - lastTime) / 10;
  lastTime = currentTime;

  // Call the updateAnimation function again on the next frame
  requestAnimationFrame(updateAnimation);

  // Get the simulation speed
  let outputSimSpeedParagraph = document.getElementById("outputSimSpeed");
  outputSimSpeedParagraph.textContent = 'Simulation Speed (x' + simSpeed + ')';

  // Get the elasticity value
  let outputElasticityParagraph = document.getElementById("outputElasticity");
  outputElasticityParagraph.textContent = 'Elasticity Value (' + elasticity + '%)';

  display();
}

// Display
function display() {

  // User interface
  userIntf();

  updateParticles(); // Update particles
  displayParticles(); // Display particles
  UIEvents.updateDataPage(); // Update circles

  // Update the circles
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();
    circles[i].displayLabels();
    // Check for collisions only if the simulation is playing
    if (play) {
      for (let j = i + 1; j < circles.length; j++) {
        if (circles[i].checkCollision(circles[j])) {
          circles[i].handleCollision(circles[j]);
        }
      }
      circles[i].updatePosition();
    } else {
      // If the simulation is paused, check if the user is grabbing a circle
      circles[i].grabChange();
    }
  }
}

// User interface
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
