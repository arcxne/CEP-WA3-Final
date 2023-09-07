// Description: This file contains all the event handlers for the UI elements

class UIEvents {
  static documentLoaded() {
    // Simulation speed slider
    this.simulationSpeedSlider = document.getElementById(
      "simulationSpeedSlider"
    );

    // Elasticity value slider
    this.elasticityValueSlider = document.getElementById(
      "elasticityValueSlider"
    );

    // Circle number input box
    this.circlesNumInput = document.getElementById("circlesNumInput");

    // Body data layout template
    this.bodyDataLayoutTemplate = document.getElementById("bodyDataLayout");

    // Number of bodies input box
    this.bodiesNumberInput = document.getElementById("circlesNumInput");

    // Data page
    this.dataPage = document.getElementById("dataPage");
  }

  // Event handler for when the user clicks the play/pause button
  static playPauseBtnClicked() {
    // Toggle play/pause
    play = !play;

    // Define play/pause icons
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    // Update play/pause button icon
    if (play) {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    }
  }

  // Event handler for when the user clicks the forward one frame button
  static forwardOneFrameBtnClicked() {
    // Play one frame for certain amount of time
    play = !play;
    setTimeout(() => {
      play = !play;
    }, 1000 / 60);
  }

  // Event handler for when the user changes the simulation speed slider
  static simulationSpeedChanged() {
    simSpeed = parseFloat(this.simulationSpeedSlider.value);
  }

  // Event handler for when the user changes the elasticity value slider
  static elasticityValueChanged() {
    elasticity = parseInt(this.elasticityValueSlider.value);
  }

  // Event handler for when the user changes the number of bodies
  static numCirclesChanged() {
    let element = this.circlesNumInput;
    if (element == null || element == '') return; // If the element is null or empty, return

    // Get the new number of circles
    let newCirclesNum = parseFloat(element.value);
    newCirclesNum = newCirclesNum < 1 ? 1 : newCirclesNum;
    newCirclesNum = newCirclesNum > 5 ? 5 : newCirclesNum;

    // Update the number of circles
    if (newCirclesNum < circlesNum) {
      this.removeCircle(newCirclesNum);
    } else if (newCirclesNum > circlesNum) {
      this.addCircle(newCirclesNum);
    }
  }

  // Event handler for when the user clicks the add circle button
  static addCircle(num) {
    for (let i = circlesNum; i < num; i++) {
      // Create a new circle
      let colour = color(random(0, 255), random(0, 255), random(0, 255));
      circles.push(
        new Circle(
          random(0, walls[2]),
          random(0, walls[3]),
          random(-10, 10),
          random(-10, 10),
          random(1, 10),
          colour
        )
      );

      // Update the data panel for the new circle
      this.updateDataPanel(circles[i]);
    }

    // Update the number of circles
    circlesNum = num;
  }

  // Event handler for when the user clicks the remove circle button
  static removeCircle(num) {
    if (num >= circlesNum) {
      return; // Nothing to remove if the number is not valid just in case
    }

    // Remove circles from the array
    circles.splice(num, circlesNum - num);

    let controls = this.dataPage.querySelectorAll(".bodyDataControl");
    this.dataPage.removeChild(controls[controls.length - 1]);
    
    // Update the number of circles
    circlesNum = num;
  }


  // Event handler for adding data to the data page
  static updateDataPanel(circle) {
    // Create a new data panel element for the circle
    const dataPanel = this.bodyDataLayoutTemplate.cloneNode(true);
    dataPanel.classList.remove("hidden");

    // Update the data panel with the circle's information
    const circleIndex = circles.indexOf(circle);
    dataPanel.querySelector(".collapse-title-label").textContent = `Body ${circleIndex + 1} Data`;
    dataPanel.querySelector(".mass").value = circle.mass;
    dataPanel.querySelector(".px").value = circle.x.toFixed(0);
    dataPanel.querySelector(".py").value = circle.y.toFixed(0);
    dataPanel.querySelector(".vx").value = circle.velx.toFixed(2);
    dataPanel.querySelector(".vy").value = circle.vely.toFixed(2);
    dataPanel.querySelector(".ke").value = circle.ke.toFixed(2);
    dataPanel.querySelector(".momentum").value = circle.momentum.toFixed(2);
    dataPanel.querySelector(".body-circle").style.backgroundColor = circle.colour;

    // Append the data panel to the right-side data panel container
    const dataContainer = document.getElementById("dataPage");
    dataContainer.appendChild(dataPanel);

    // Remove existing event listeners
    dataPanel.querySelectorAll("input").forEach((input) => {
      input.removeEventListener("input", UIEvents.updateCircleData);
    });

    // Add an event listener to update circle data when user edits input fields
    dataPanel.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value == '') return;
        UIEvents.updateCircleData(circleIndex, input);
      });
    });
  }

  // Event handler for updating circle data
  static updateCircleData(circleIndex, inputElement) {
    // Update the corresponding circle's data based on the input element
    const circle = circles[circleIndex];
    const className = inputElement.className;

    // Update the circle's data based on the input element
    if (className.includes("mass")) {
      let x = parseFloat(inputElement.value);
      x = x < 1 ? 1 : x; // Limit the mass to 1
      x = x > 10 ? 10 : x; // Limit the mass to 10
      circle.mass = x;
    } else if (className.includes("px")) {
      circle.x = parseFloat(inputElement.value);
    } else if (className.includes("py")) {
      circle.y = parseFloat(inputElement.value);
    } else if (className.includes("vx")) {
      circle.velx = parseFloat(inputElement.value);
    } else if (className.includes("vy")) {
      circle.vely = parseFloat(inputElement.value);
    }
  }

  // Event handler for updating the data page in realtime
  static updateDataPage() {
    //Update the "number of bodies" input box, if the user is not editing it
    if (document.activeElement != this.bodiesNumberInput) {
      this.bodiesNumberInput.value = circles.length;
    }

    //Update the bodydatacontrols with the mass, position, velocity of their corresponding bodies
    let bodyDataControls = this.dataPage.querySelectorAll(".bodyDataControl");
    for (let i = 0; i < circles.length; i++) {
      let bodyDataControl = bodyDataControls[i];
      let body = circles[i];

      //Get relevant controls to update
      let massInput = bodyDataControl.querySelector(".mass");
      let posXInput = bodyDataControl.querySelector(".px");
      let posYInput = bodyDataControl.querySelector(".py");
      let velocityXInput = bodyDataControl.querySelector(".vx");
      let velocityYInput = bodyDataControl.querySelector(".vy");
      let keLabel = bodyDataControl.querySelector(".ke");
      let momentumLabel = bodyDataControl.querySelector(".momentum");

      //Update control values if the user is not editing them (aka they do not have focus)
      massInput.value = document.activeElement != massInput ? body.mass.toFixed(0) : massInput.value;
      posXInput.value = document.activeElement != posXInput ? body.x.toFixed(0) : posXInput.value;
      posYInput.value = document.activeElement != posYInput ? body.y.toFixed(0) : posYInput.value;
      velocityXInput.value = document.activeElement != velocityXInput ? body.velx.toFixed(2) : velocityXInput.value;
      velocityYInput.value = document.activeElement != velocityYInput ? body.vely.toFixed(2) : velocityYInput.value;
      bodyDataControl.querySelector(".body-circle").style.backgroundColor = body.colour;
      keLabel.value = body.ke.toFixed(2);
      momentumLabel.value = body.momentum.toFixed(2);
    }
  }
}