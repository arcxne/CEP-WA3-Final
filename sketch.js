var circles = [];
var Number_of_circles = 0;
var Number_of_circlesMin = 1;
var Number_of_circlesMax = 4;
var Number_of_circlesStep = 1;
var walls = [15, 15, 585, 585];
var Play = false;
var Slow = false; // TODO: Add slow option
var Elasticity = 90; // Elastic collision
var grabRadius = 40;
var grabbing = false;
var globalGrabDir = false;

var gui, gui2;

function setup() {
  createCanvas(1000, 600);

  circles.push(
    new Circle(
      50,
      walls[3] / 2 + 50,
      15,
      5,
      2,
      1,
      color(255, 0, 0)
    )
  );

  circles.push(
    new Circle(
      walls[2] - 50,
      walls[3] / 2,
      30,
      -2,
      4,
      5,
      color(0, 0, 255)
    )
  );

  circles.push(
    new Circle(
      walls[2] / 2,
      walls[3] / 2 - 50,
      45,
      0,
      10,
      5,
      color(125, 125, 0)
    )
  );
  
  Number_of_circles = circles.length;

  gui = createGui('Main Control Panel');
  sliderRange(1, 100, 1);
  gui.addGlobals('Play', 'Slow', 'Number_of_circles', 'Elasticity');
  // gui2.addGlobals(); KE, CG, vel, momentum, path, values
}

function draw() {
  background(180);

  // setTimeout(draw, 2000);

  display();
}

function display() {

  userIntf();
  
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();
    circles[i].displayLabels();
    if (Play) {
      circles[i].updatePosition(Elasticity);
      for (let j = i + 1; j < circles.length; j++) {
        if (circles[i].checkCollision(circles[j])) {
          circles[i].handleCollision(circles[j]);
          circles[i].adjustPositions(circles[j]);
        }
      }
    } else {
      circles[i].grabChange();
    }
  }
}

function userIntf() {
  gui.setPosition(walls[2] + walls[0], walls[1]+8);
  noStroke();
  fill(225);
  rect(walls[0], walls[1], walls[2]-walls[0], walls[3]-walls[1]);
}

// Mouse events
function mousePressed() {
  grabbing = true;
}

function mouseReleased() {
  grabbing = false;
  globalGrabDir = false;
}